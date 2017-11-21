var Rule = function() {
    var rule = new Vue({
        el: "#ruleComponent",
        data: {
            ruleList: new PaginableComponent({url: '/v1/mjwebapisrv/rules'}),
            pageSize: "25",
            searchKeyWord: "",
            newRule: {}
        },
        mounted: function() {
            this.ruleList.pagination.pageSize = Number(this.pageSize);
            this.ruleList.gotoPage(1);
        },
        methods: {
            onPageSizeChange: function() {
                this.ruleList.setPageSize(Number(this.pageSize));
                this.ruleList.reloadPage();
            },
            newRuleModal: function() {
                $('#newRuleModal').modal('show')
            },
            createNewRule: function() {
                var self = this;
                var rule = this.newRule;
                var body = {
                    rule_name: rule.ruleName,
                    rule_version: Number(rule.ruleVersion),
                    rule_content: rule.ruleContent,
                    rule_type: rule.ruleType,
                    rule_comment: rule.ruleComment,
                    risk_score: Number(rule.riskScore),
                    rule_tags: rule.ruleTags,
                    rule_class: rule.ruleClass,
                    is_parallel: Number(rule.isParallel == "true" ? true : false),
                    rule_status: Number(rule.ruleStatus)
                };

                App.network.post('/v1/mjwebapisrv/rules', {
                    data: body
                }).then(function(response){
                    $('#newRuleModal').modal('hide');
                    self.ruleList.reloadPage();

                }).catch(function(response) {
                    //refine
                    alert('error');
                    $('#newRuleModal').modal('hide');
                });
            }
        }
    });
};