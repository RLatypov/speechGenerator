"use strict";

function getDataMainTemplate(results) {
    var data = [];

    angular.forEach(results.rows, function(value) {
        var arr = value.phrase.split('||'),
            phrase = [];

        angular.forEach(arr, function(value) {
            phrase.push({name: value});
        });

        data.push({
            name: value.name,
            phrase: phrase
        });
    });

    return data;
}

function dropTable($scope,table) {
    $scope.db.dropTable(table);
}

function openDataBase($scope,$webSql) {
    $scope.db = $webSql.openDatabase('SpeechGenerator', '0.1', 'A list of phrases.', 200000);

    //dropTable($scope,'phrases');

    if(!$scope.db) {
        showModal('Ошибка','Не удалось подключиться к базе данных Web SQL.');
    }
}

function addToDatabase($scope) {
    var tableName= 'phrases';

    $scope.db.selectAll(tableName).then(
        function() {
            $scope.db.delAll(tableName);
            insertToTable($scope,tableName);
        },
        function() {
            $scope.db.createTable(tableName, {
                "id":{
                    "type": "INTEGER",
                    "null": "NOT NULL",
                    "primary": true,
                    "auto_increment": true
                },
                "name": {
                    "type": "TEXT",
                    "null": "NOT NULL"
                },
                "phrase": {
                    "type": "TEXT",
                    "null": "NOT NULL"
                },
                "created": {
                    "type": "TIMESTAMP",
                    "null": "NOT NULL",
                    "default": "CURRENT_TIMESTAMP"
                }
            });
            insertToTable($scope,tableName);
        }
    );
}

function insertToTable($scope,tableName) {
    angular.forEach($scope.phrases, function(value) {
        var phrases = '',
            name = value.name;

        angular.forEach(value.phrase, function(value) {
            phrases += value.name + '||';
        });

        //Delete last ||
        phrases = phrases.substring(0, phrases.length - 2);

        $scope.db.insert(tableName, {"name": name,"phrase": phrases}).then(
            function(results) {},
            function() {
                showModal('Ошибка','Не удалось добавить в базу данных.');
            }
        );
    });
}

function disableEditMainTemplate(targetElement) {
    var tableMainTemplate = $('.table-main-template');

    tableMainTemplate
        .addClass('opacity')
        .find('[contenteditable]')
        .attr('contenteditable','false');

    targetElement
        .attr('disabled','true')
        .next()
        .removeAttr('disabled');
}

function isValidate($scope) {
    var result = true, phrases = '';

    angular.forEach($scope.phrases, function(value) {
        angular.forEach(value.phrase, function(value) {
            phrases += value.name;
        });
    });

    phrases = phrases.toLowerCase();

    angular.forEach($scope.specifications, function(value) {
        if(phrases.indexOf('{{'+value.name+'}}'.toLowerCase()) == -1) {
           result = false;
        }
    });

    return result;
}

function generation($scope) {
    var phrases = '';

    angular.forEach($scope.phrases, function(value) {
        var rand = randomNumber(value.phrase.length);
        phrases += value.phrase[rand].name + ' ';
    });

    angular.forEach($scope.specifications, function(value) {
        phrases = phrases.replace('{{'+value.name+'}}',value.value);
    });

    showModal('Фраза',phrases);
}

function randomNumber(length) {
    return Math.floor(Math.random() * length);
}

function showModal(title,content) {
    var window = $('#modal');

    window
        .find('.modal-body')
        .text(content);

    window
        .find('.modal-title')
        .text(title);

    window.modal('show');
}