var Rule = function() {
    var rule = new Vue({
        el: "#ruleComponent",
        data: {
            ruleList: new PaginableComponent({url: '/v1/mjwebapisrv/rules'}),
            pageSize: "25",
            searchKeyWord: "",
            newRule: {},
            editRule: {}
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
                $('#newRuleModal').modal('show');
            },
            createNewRule: function() {
                var self = this;
                var rule = self.newRule;
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
                    $('#newRuleModal').modal('hide');
                });
            },
            saveEditRule: function() {
                var self = this;
                var body = {
                    rule_name: this.editRule.name,
                    rule_version: Number(this.editRule.version),
                    rule_content: this.editRule.content,
                    rule_type: this.editRule.type,
                    rule_comment: this.editRule.comment,
                    risk_score: Number(this.editRule.score),
                    rule_tags: this.editRule.tag,
                    rule_class: this.editRule.class,
                    is_parallel: Number(this.editRule.parallel),
                    rule_status: Number(this.editRule.status)
                };

                App.network.put('/v1/mjwebapisrv/rules/' + this.editRule.id.toString(), {
                    data: body
                }).then(function(response){
                    $('#editRuleModal').modal('hide');
                    self.ruleList.reloadPage();
                });
            },
            editRuleModal: function(rule) {
                this.editRule = Object.create(rule);
                $('#editRuleModal').modal('show');
            },
            editRuleModalSave: function() {

            },
            toRuleStatus: function(status) {
                switch(status) {
                    case 0:
                        return '灰度';
                    case 1:
                        return '生效';
                    case 2:
                        return '失效';
                }
            }
        }
    });
};