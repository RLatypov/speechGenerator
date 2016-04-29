var speechGeneratorApp = angular.module('speechGeneratorApp', ['angular-websql']);

speechGeneratorApp.directive("contenteditable", function() {
    return {
        restrict: "A",
        require: "ngModel",
        link: function(scope, element, attrs, ngModel) {
            function read() {
                ngModel.$setViewValue(element.html());
            }

            ngModel.$render = function() {
                element.html(ngModel.$viewValue || "");
            };

            element.bind("blur keyup change", function() {
                scope.$apply(read);
            });
        }
    };
});

speechGeneratorApp.controller('SpeechGenerator', ['$scope', '$webSql', function($scope, $webSql) {

    openDataBase($scope,$webSql);

    $scope.db.selectAll('phrases').then(
        function(results) {
            $scope.phrases = getDataMainTemplate(results);
        },
        function() {
            $scope.phrases = [
                {
                    name: 'Фраза 1',
                    phrase: [
                        { name: 'Уважаемый(е) {{greeting}}' },
                        { name: 'Следует отметить что' },
                        { name: 'С другой стороны' },
                        { name: 'Для {{whom}}' },
                        { name: 'Прежде всего' },
                        { name: 'Не вызывает сомнений что'}
                    ]
                } ,
                {
                    name: 'Фраза 2',
                    phrase: [
                        { name: 'социально-экономическое развитие' },
                        { name: 'выбранный нами {{choise}}' },
                        { name: 'повышение уровня гражданского сознания' },
                        { name: 'высокотехнологическая концепция общественной системы' },
                        { name: 'курс на {{way}}' },
                        { name: 'понимание сущности {{gist}}' }
                    ]
                },
                {
                    name: 'Фраза 3',
                    phrase: [
                        { name: 'способствует повышению качества' },
                        { name: 'обеспечивает актуальность' },
                        { name: 'требует анализа' },
                        { name: 'напрямую зависит от' },
                        { name: 'создает предпосылки качественно новых шагов для' },
                        { name: 'играет важную роль в формировании' }
                    ]
                },
                {
                    name: 'Фраза 4',
                    phrase: [
                        { name: 'поставленных обществом и правительством задач.' },
                        { name: 'укрепления демократической системы.' },
                        { name: 'новых принципов формирования материально-технической и кадровой базы.' },
                        { name: 'прогресса профессионального сообщества.' },
                        { name: 'поэтапного и последовательного развития общества.' },
                        { name: 'экономической целесообразности принимаемых изменений.' }
                    ]
                }
            ];
        }
    );

    $scope.specifications = [
        { name: 'greeting', value: 'дамы и господа' },
        { name: 'choise',   value: 'инновационный путь' },
        { name: 'whom',     value: 'современного мира' },
        { name: 'way',      value: 'социально-ориентированный проект' },
        { name: 'gist',     value: 'ресурсосберегающих технологий' }
    ];

    $scope.approveMainTemplate = function() {
        addToDatabase($scope,$webSql);
        disableEditMainTemplate(angular.element(event.target));
    };

    $scope.runGeneration = function() {
        if(isValidate($scope)) {
            generation($scope);
        } else {
            showModal('Ошибка','Есть расхождения уточнений с главным шаблоном');
        }
    };

}]);