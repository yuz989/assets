Vue.component('paginate', VuejsPaginate);

var App = {
    init: function(config) {
        this.config = config || {
            debug: false,
            webApiBaseURL: "http://mj.klook.io"
        };
        this.config.vueBootstrapMap = {
            'assets/rule/event.html': Event,
            'assets/rule/rule.html': Rule,
            'assets/rule/ruleresult.html': RuleAnalysis,
            'assets/graph/graph.html': Graph,
            'assets/risk/riskmanualaudit.html': RiskAudit,
            'assets/risk/eventsnap.html': EventSession,
            'assets/list/list.html': RiskList
        };
    },
    network: {
        fetch: function(path, callback, param) {
            param = param || {
                mode: 'no-cors'
            };

            callback = callback || {
                success: function(d){},
                fail: function(d){}
            };

            var requestURL = App.config.webApiBaseURL + path;
            return axios.get(requestURL, param).then(function(response) {
                if(response.data.success) {
                    callback.success(response.data.result);
                } else {
                    callback.fail(response.data.error);
                }
            }).catch(function(response) {
                //refine
                alert('error');
            });
        },
        post: function(url, param) {
            param.mode = 'no-cors';
            var requestURL = App.config.webApiBaseURL + url;
            return axios.post(
                requestURL,
                param.data
            ).then(function(r) {
                //refine
                console.log(r);
            }).catch(function(r) {
                //refine
                alert('error');
            })
        }
    }
};

function loadhtmlToContainer(html) {
    $('#main-container').load(html, function() {
        var bootstrapFunc = App.config.vueBootstrapMap[html];
        if(bootstrapFunc) {
            bootstrapFunc();
        } else {
            console.log(html + " not found");
        }
    });
    window.location.hash = html;
}

window.onload = function(ev) {
    App.init();

    // 默认首页
    var hash = window.location.hash;
    var html = 'assets/graph/graph.html';
    if (hash != "") {
        html = hash.substr(1);
    }
    console.log("hash:" + hash);
    loadhtmlToContainer(html);
};
