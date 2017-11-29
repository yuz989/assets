Vue.component('paginate', VuejsPaginate);
Vue.use(VeeValidate);

var Widget = function() {
    this.alert = {
        message: "",
        msgType: "danger",
        show: function(message, msgType, delay) {
            this.message = message;
            this.msgType = msgType;
            $('#widget-alert').show();
            setTimeout(function() {
                $('#widget-alert').hide();
            }, delay || 2000)
        },
        display: function(message, msgType) {
            this.message = message;
            this.msgType = msgType;
            $('#widget-alert').show();
        },
        hide: function() {
            this.message = '';
            this.msgType = 'danger';
            $('#widget-alert').hide();
        },
        getClass: function() {
            switch(this.msgType) {
                case 'success':
                    return 'alert-success';
                case 'info':
                    return 'alert-info';
                case 'danger':
                    return 'alert-danger';
                case 'warning':
                    return 'alert-warning';
                default:
                    return 'alert-danger';
            }
        },
        getLabel: function() {
            switch(this.msgType) {
                case 'success':
                    return '';
                case 'info':
                    return 'INFO:';
                case 'danger':
                    return 'ERROR:';
                case 'warning':
                    return 'WARNING:';
                default:
                    return 'ERROR:';
            }
        }
    };
};

var App = {
    init: function(config) {
        this.config = config || {
            debug: false
        };
        this.config.vueBootstrapMap = {
            'assets/rule/event.html': Event,
            'assets/rule/rule.html': Rule,
            'assets/rule/eventrules.html': EventRule,
            'assets/rule/ruleresult.html': RuleAnalysis,
            'assets/rule/ruletest.html': RuleTest,
            'assets/graph/graph.html': Graph,
            'assets/risk/riskmanualaudit.html': RiskAudit,
            'assets/risk/risksessionhistory.html': RiskSessionHistory,
            'assets/risk/eventsnap.html': EventSession,
            'assets/list/list.html': RiskList
        };

        this.Vue = new Vue({
            el: "#VueApp",
            data: {
                widget: new Widget()
            },
        });
        this._init = true;
    },
    network: {
        fetch: function(path, callback, param) {
            callback = callback || {
                success: function(d){},
                fail: function(d){}
            };

            param = param || {
                mode: 'no-cors'
            };

            return axios.get(this._path(path), param).then(function(response) {
                if(response.data.success) {
                    callback.success(response.data.result);
                } else {
                    callback.fail(response.data.error);
                }
            }).catch(function(r) {
                App.Vue.widget.alert.show((r.response.status + " " + r.response.statusText + "\n" + r.response.data), 3000);
            });
        },
        get: function(url, param) {
            param = param || {};
            return axios({
                method: 'get',
                url: this._path(url)
            }).catch(function(r) {
                alert(1);
            });
        },
        post: function(path, param) {
            param = param || {};
            var callback = param.callback || {
                success: function(d){},
                fail: function(d){}
            };
            return axios({
                method: 'post',
                url: this._path(path),
                data: param.data,
                timeout: param.timeout || 600000
            }).catch(function(response) {
                App.Vue.widget.alert.show((r.response.status + " " + r.response.statusText + "\n" + r.response.data), 3000);
            });
        },
        put: function(path, param) {
            param = param || {};
            var callback = param.callback || {
                success: function(d){},
                fail: function(d){}
            };

            return axios({
                method: 'put',
                url: this._path(path),
                data: param.data
            }).then(function(response) {
                if(response.data.success) {
                    callback.success(response.data.result);
                  } else {
                    callback.fail(response.data.error);
                }
            }).catch(function(response) {
                App.Vue.widget.alert.show((r.response.status + " " + r.response.statusText + "\n" + r.response.data), 3000);
            });
        },
        delete: function(path, param) {
            param = param || {};
            var callback = param.callback || {
                success: function(d){},
                fail: function(d){}
            };
            return axios({
                method: 'delete',
                url: this._path(path),
                data: param.data
            }).catch(function(response) {
                App.Vue.widget.alert.show((r.response.status + " " + r.response.statusText + "\n" + r.response.data), 3000);
            });
        },
        _path: function(path) {
            return '/v1/mjwebsrv' + path;
        }
    },
    widget: {
        alert: function(message, delay) {
            $("#widget-alert").alert.show(message, delay);
        }
    },
    _init: false
};

function loadhtmlToContainer(html) {
    $('#main-container').load(html, function() {
        console.log(html);
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
    if(!App._init) {
        App.init();
    }
    // 默认首页
    var hash = window.location.hash;
    var html = 'assets/graph/graph.html';
    if (hash != "") {
        html = hash.substr(1);
    }
    console.log("hash:" + hash);
    loadhtmlToContainer(html);
};
