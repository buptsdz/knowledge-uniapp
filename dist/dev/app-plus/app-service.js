if (typeof Promise !== "undefined" && !Promise.prototype.finally) {
  Promise.prototype.finally = function(callback) {
    const promise = this.constructor;
    return this.then(
      (value) => promise.resolve(callback()).then(() => value),
      (reason) => promise.resolve(callback()).then(() => {
        throw reason;
      })
    );
  };
}
;
if (typeof uni !== "undefined" && uni && uni.requireGlobal) {
  const global2 = uni.requireGlobal();
  ArrayBuffer = global2.ArrayBuffer;
  Int8Array = global2.Int8Array;
  Uint8Array = global2.Uint8Array;
  Uint8ClampedArray = global2.Uint8ClampedArray;
  Int16Array = global2.Int16Array;
  Uint16Array = global2.Uint16Array;
  Int32Array = global2.Int32Array;
  Uint32Array = global2.Uint32Array;
  Float32Array = global2.Float32Array;
  Float64Array = global2.Float64Array;
  BigInt64Array = global2.BigInt64Array;
  BigUint64Array = global2.BigUint64Array;
}
;
if (uni.restoreGlobal) {
  uni.restoreGlobal(Vue, weex, plus, setTimeout, clearTimeout, setInterval, clearInterval);
}
(function(vue, shared) {
  var _e, _f;
  "use strict";
  function formatAppLog(type, filename, ...args) {
    if (uni.__log__) {
      uni.__log__(type, filename, ...args);
    } else {
      console[type].apply(console, [...args, filename]);
    }
  }
  function resolveEasycom(component, easycom) {
    return shared.isString(component) ? easycom : component;
  }
  function getDevtoolsGlobalHook() {
    return getTarget().__VUE_DEVTOOLS_GLOBAL_HOOK__;
  }
  function getTarget() {
    return typeof navigator !== "undefined" && typeof window !== "undefined" ? window : typeof global !== "undefined" ? global : {};
  }
  const isProxyAvailable = typeof Proxy === "function";
  const HOOK_SETUP = "devtools-plugin:setup";
  const HOOK_PLUGIN_SETTINGS_SET = "plugin:settings:set";
  let supported;
  let perf;
  function isPerformanceSupported() {
    var _a;
    if (supported !== void 0) {
      return supported;
    }
    if (typeof window !== "undefined" && window.performance) {
      supported = true;
      perf = window.performance;
    } else if (typeof global !== "undefined" && ((_a = global.perf_hooks) === null || _a === void 0 ? void 0 : _a.performance)) {
      supported = true;
      perf = global.perf_hooks.performance;
    } else {
      supported = false;
    }
    return supported;
  }
  function now() {
    return isPerformanceSupported() ? perf.now() : Date.now();
  }
  class ApiProxy {
    constructor(plugin, hook) {
      this.target = null;
      this.targetQueue = [];
      this.onQueue = [];
      this.plugin = plugin;
      this.hook = hook;
      const defaultSettings = {};
      if (plugin.settings) {
        for (const id in plugin.settings) {
          const item = plugin.settings[id];
          defaultSettings[id] = item.defaultValue;
        }
      }
      const localSettingsSaveId = `__vue-devtools-plugin-settings__${plugin.id}`;
      let currentSettings = Object.assign({}, defaultSettings);
      try {
        const raw = localStorage.getItem(localSettingsSaveId);
        const data = JSON.parse(raw);
        Object.assign(currentSettings, data);
      } catch (e) {
      }
      this.fallbacks = {
        getSettings() {
          return currentSettings;
        },
        setSettings(value) {
          try {
            localStorage.setItem(localSettingsSaveId, JSON.stringify(value));
          } catch (e) {
          }
          currentSettings = value;
        },
        now() {
          return now();
        }
      };
      if (hook) {
        hook.on(HOOK_PLUGIN_SETTINGS_SET, (pluginId, value) => {
          if (pluginId === this.plugin.id) {
            this.fallbacks.setSettings(value);
          }
        });
      }
      this.proxiedOn = new Proxy({}, {
        get: (_target, prop) => {
          if (this.target) {
            return this.target.on[prop];
          } else {
            return (...args) => {
              this.onQueue.push({
                method: prop,
                args
              });
            };
          }
        }
      });
      this.proxiedTarget = new Proxy({}, {
        get: (_target, prop) => {
          if (this.target) {
            return this.target[prop];
          } else if (prop === "on") {
            return this.proxiedOn;
          } else if (Object.keys(this.fallbacks).includes(prop)) {
            return (...args) => {
              this.targetQueue.push({
                method: prop,
                args,
                resolve: () => {
                }
              });
              return this.fallbacks[prop](...args);
            };
          } else {
            return (...args) => {
              return new Promise((resolve) => {
                this.targetQueue.push({
                  method: prop,
                  args,
                  resolve
                });
              });
            };
          }
        }
      });
    }
    async setRealTarget(target) {
      this.target = target;
      for (const item of this.onQueue) {
        this.target.on[item.method](...item.args);
      }
      for (const item of this.targetQueue) {
        item.resolve(await this.target[item.method](...item.args));
      }
    }
  }
  function setupDevtoolsPlugin(pluginDescriptor, setupFn) {
    const descriptor = pluginDescriptor;
    const target = getTarget();
    const hook = getDevtoolsGlobalHook();
    const enableProxy = isProxyAvailable && descriptor.enableEarlyProxy;
    if (hook && (target.__VUE_DEVTOOLS_PLUGIN_API_AVAILABLE__ || !enableProxy)) {
      hook.emit(HOOK_SETUP, pluginDescriptor, setupFn);
    } else {
      const proxy = enableProxy ? new ApiProxy(descriptor, hook) : null;
      const list = target.__VUE_DEVTOOLS_PLUGINS__ = target.__VUE_DEVTOOLS_PLUGINS__ || [];
      list.push({
        pluginDescriptor: descriptor,
        setupFn,
        proxy
      });
      if (proxy)
        setupFn(proxy.proxiedTarget);
    }
  }
  /*!
   * vuex v4.1.0
   * (c) 2022 Evan You
   * @license MIT
   */
  var storeKey = "store";
  function forEachValue(obj, fn) {
    Object.keys(obj).forEach(function(key) {
      return fn(obj[key], key);
    });
  }
  function isObject$1(obj) {
    return obj !== null && typeof obj === "object";
  }
  function isPromise(val) {
    return val && typeof val.then === "function";
  }
  function assert(condition, msg) {
    if (!condition) {
      throw new Error("[vuex] " + msg);
    }
  }
  function partial(fn, arg) {
    return function() {
      return fn(arg);
    };
  }
  function genericSubscribe(fn, subs, options) {
    if (subs.indexOf(fn) < 0) {
      options && options.prepend ? subs.unshift(fn) : subs.push(fn);
    }
    return function() {
      var i = subs.indexOf(fn);
      if (i > -1) {
        subs.splice(i, 1);
      }
    };
  }
  function resetStore(store2, hot) {
    store2._actions = /* @__PURE__ */ Object.create(null);
    store2._mutations = /* @__PURE__ */ Object.create(null);
    store2._wrappedGetters = /* @__PURE__ */ Object.create(null);
    store2._modulesNamespaceMap = /* @__PURE__ */ Object.create(null);
    var state = store2.state;
    installModule(store2, state, [], store2._modules.root, true);
    resetStoreState(store2, state, hot);
  }
  function resetStoreState(store2, state, hot) {
    var oldState = store2._state;
    var oldScope = store2._scope;
    store2.getters = {};
    store2._makeLocalGettersCache = /* @__PURE__ */ Object.create(null);
    var wrappedGetters = store2._wrappedGetters;
    var computedObj = {};
    var computedCache = {};
    var scope = vue.effectScope(true);
    scope.run(function() {
      forEachValue(wrappedGetters, function(fn, key) {
        computedObj[key] = partial(fn, store2);
        computedCache[key] = vue.computed(function() {
          return computedObj[key]();
        });
        Object.defineProperty(store2.getters, key, {
          get: function() {
            return computedCache[key].value;
          },
          enumerable: true
          // for local getters
        });
      });
    });
    store2._state = vue.reactive({
      data: state
    });
    store2._scope = scope;
    if (store2.strict) {
      enableStrictMode(store2);
    }
    if (oldState) {
      if (hot) {
        store2._withCommit(function() {
          oldState.data = null;
        });
      }
    }
    if (oldScope) {
      oldScope.stop();
    }
  }
  function installModule(store2, rootState, path, module, hot) {
    var isRoot = !path.length;
    var namespace = store2._modules.getNamespace(path);
    if (module.namespaced) {
      if (store2._modulesNamespaceMap[namespace] && true) {
        console.error("[vuex] duplicate namespace " + namespace + " for the namespaced module " + path.join("/"));
      }
      store2._modulesNamespaceMap[namespace] = module;
    }
    if (!isRoot && !hot) {
      var parentState = getNestedState(rootState, path.slice(0, -1));
      var moduleName = path[path.length - 1];
      store2._withCommit(function() {
        {
          if (moduleName in parentState) {
            console.warn(
              '[vuex] state field "' + moduleName + '" was overridden by a module with the same name at "' + path.join(".") + '"'
            );
          }
        }
        parentState[moduleName] = module.state;
      });
    }
    var local = module.context = makeLocalContext(store2, namespace, path);
    module.forEachMutation(function(mutation, key) {
      var namespacedType = namespace + key;
      registerMutation(store2, namespacedType, mutation, local);
    });
    module.forEachAction(function(action, key) {
      var type = action.root ? key : namespace + key;
      var handler = action.handler || action;
      registerAction(store2, type, handler, local);
    });
    module.forEachGetter(function(getter, key) {
      var namespacedType = namespace + key;
      registerGetter(store2, namespacedType, getter, local);
    });
    module.forEachChild(function(child, key) {
      installModule(store2, rootState, path.concat(key), child, hot);
    });
  }
  function makeLocalContext(store2, namespace, path) {
    var noNamespace = namespace === "";
    var local = {
      dispatch: noNamespace ? store2.dispatch : function(_type, _payload, _options) {
        var args = unifyObjectStyle(_type, _payload, _options);
        var payload = args.payload;
        var options = args.options;
        var type = args.type;
        if (!options || !options.root) {
          type = namespace + type;
          if (!store2._actions[type]) {
            console.error("[vuex] unknown local action type: " + args.type + ", global type: " + type);
            return;
          }
        }
        return store2.dispatch(type, payload);
      },
      commit: noNamespace ? store2.commit : function(_type, _payload, _options) {
        var args = unifyObjectStyle(_type, _payload, _options);
        var payload = args.payload;
        var options = args.options;
        var type = args.type;
        if (!options || !options.root) {
          type = namespace + type;
          if (!store2._mutations[type]) {
            console.error("[vuex] unknown local mutation type: " + args.type + ", global type: " + type);
            return;
          }
        }
        store2.commit(type, payload, options);
      }
    };
    Object.defineProperties(local, {
      getters: {
        get: noNamespace ? function() {
          return store2.getters;
        } : function() {
          return makeLocalGetters(store2, namespace);
        }
      },
      state: {
        get: function() {
          return getNestedState(store2.state, path);
        }
      }
    });
    return local;
  }
  function makeLocalGetters(store2, namespace) {
    if (!store2._makeLocalGettersCache[namespace]) {
      var gettersProxy = {};
      var splitPos = namespace.length;
      Object.keys(store2.getters).forEach(function(type) {
        if (type.slice(0, splitPos) !== namespace) {
          return;
        }
        var localType = type.slice(splitPos);
        Object.defineProperty(gettersProxy, localType, {
          get: function() {
            return store2.getters[type];
          },
          enumerable: true
        });
      });
      store2._makeLocalGettersCache[namespace] = gettersProxy;
    }
    return store2._makeLocalGettersCache[namespace];
  }
  function registerMutation(store2, type, handler, local) {
    var entry = store2._mutations[type] || (store2._mutations[type] = []);
    entry.push(function wrappedMutationHandler(payload) {
      handler.call(store2, local.state, payload);
    });
  }
  function registerAction(store2, type, handler, local) {
    var entry = store2._actions[type] || (store2._actions[type] = []);
    entry.push(function wrappedActionHandler(payload) {
      var res = handler.call(store2, {
        dispatch: local.dispatch,
        commit: local.commit,
        getters: local.getters,
        state: local.state,
        rootGetters: store2.getters,
        rootState: store2.state
      }, payload);
      if (!isPromise(res)) {
        res = Promise.resolve(res);
      }
      if (store2._devtoolHook) {
        return res.catch(function(err) {
          store2._devtoolHook.emit("vuex:error", err);
          throw err;
        });
      } else {
        return res;
      }
    });
  }
  function registerGetter(store2, type, rawGetter, local) {
    if (store2._wrappedGetters[type]) {
      {
        console.error("[vuex] duplicate getter key: " + type);
      }
      return;
    }
    store2._wrappedGetters[type] = function wrappedGetter(store3) {
      return rawGetter(
        local.state,
        // local state
        local.getters,
        // local getters
        store3.state,
        // root state
        store3.getters
        // root getters
      );
    };
  }
  function enableStrictMode(store2) {
    vue.watch(function() {
      return store2._state.data;
    }, function() {
      {
        assert(store2._committing, "do not mutate vuex store state outside mutation handlers.");
      }
    }, { deep: true, flush: "sync" });
  }
  function getNestedState(state, path) {
    return path.reduce(function(state2, key) {
      return state2[key];
    }, state);
  }
  function unifyObjectStyle(type, payload, options) {
    if (isObject$1(type) && type.type) {
      options = payload;
      payload = type;
      type = type.type;
    }
    {
      assert(typeof type === "string", "expects string as the type, but found " + typeof type + ".");
    }
    return { type, payload, options };
  }
  var LABEL_VUEX_BINDINGS = "vuex bindings";
  var MUTATIONS_LAYER_ID = "vuex:mutations";
  var ACTIONS_LAYER_ID = "vuex:actions";
  var INSPECTOR_ID = "vuex";
  var actionId = 0;
  function addDevtools(app, store2) {
    setupDevtoolsPlugin(
      {
        id: "org.vuejs.vuex",
        app,
        label: "Vuex",
        homepage: "https://next.vuex.vuejs.org/",
        logo: "https://vuejs.org/images/icons/favicon-96x96.png",
        packageName: "vuex",
        componentStateTypes: [LABEL_VUEX_BINDINGS]
      },
      function(api) {
        api.addTimelineLayer({
          id: MUTATIONS_LAYER_ID,
          label: "Vuex Mutations",
          color: COLOR_LIME_500
        });
        api.addTimelineLayer({
          id: ACTIONS_LAYER_ID,
          label: "Vuex Actions",
          color: COLOR_LIME_500
        });
        api.addInspector({
          id: INSPECTOR_ID,
          label: "Vuex",
          icon: "storage",
          treeFilterPlaceholder: "Filter stores..."
        });
        api.on.getInspectorTree(function(payload) {
          if (payload.app === app && payload.inspectorId === INSPECTOR_ID) {
            if (payload.filter) {
              var nodes = [];
              flattenStoreForInspectorTree(nodes, store2._modules.root, payload.filter, "");
              payload.rootNodes = nodes;
            } else {
              payload.rootNodes = [
                formatStoreForInspectorTree(store2._modules.root, "")
              ];
            }
          }
        });
        api.on.getInspectorState(function(payload) {
          if (payload.app === app && payload.inspectorId === INSPECTOR_ID) {
            var modulePath = payload.nodeId;
            makeLocalGetters(store2, modulePath);
            payload.state = formatStoreForInspectorState(
              getStoreModule(store2._modules, modulePath),
              modulePath === "root" ? store2.getters : store2._makeLocalGettersCache,
              modulePath
            );
          }
        });
        api.on.editInspectorState(function(payload) {
          if (payload.app === app && payload.inspectorId === INSPECTOR_ID) {
            var modulePath = payload.nodeId;
            var path = payload.path;
            if (modulePath !== "root") {
              path = modulePath.split("/").filter(Boolean).concat(path);
            }
            store2._withCommit(function() {
              payload.set(store2._state.data, path, payload.state.value);
            });
          }
        });
        store2.subscribe(function(mutation, state) {
          var data = {};
          if (mutation.payload) {
            data.payload = mutation.payload;
          }
          data.state = state;
          api.notifyComponentUpdate();
          api.sendInspectorTree(INSPECTOR_ID);
          api.sendInspectorState(INSPECTOR_ID);
          api.addTimelineEvent({
            layerId: MUTATIONS_LAYER_ID,
            event: {
              time: Date.now(),
              title: mutation.type,
              data
            }
          });
        });
        store2.subscribeAction({
          before: function(action, state) {
            var data = {};
            if (action.payload) {
              data.payload = action.payload;
            }
            action._id = actionId++;
            action._time = Date.now();
            data.state = state;
            api.addTimelineEvent({
              layerId: ACTIONS_LAYER_ID,
              event: {
                time: action._time,
                title: action.type,
                groupId: action._id,
                subtitle: "start",
                data
              }
            });
          },
          after: function(action, state) {
            var data = {};
            var duration = Date.now() - action._time;
            data.duration = {
              _custom: {
                type: "duration",
                display: duration + "ms",
                tooltip: "Action duration",
                value: duration
              }
            };
            if (action.payload) {
              data.payload = action.payload;
            }
            data.state = state;
            api.addTimelineEvent({
              layerId: ACTIONS_LAYER_ID,
              event: {
                time: Date.now(),
                title: action.type,
                groupId: action._id,
                subtitle: "end",
                data
              }
            });
          }
        });
      }
    );
  }
  var COLOR_LIME_500 = 8702998;
  var COLOR_DARK = 6710886;
  var COLOR_WHITE = 16777215;
  var TAG_NAMESPACED = {
    label: "namespaced",
    textColor: COLOR_WHITE,
    backgroundColor: COLOR_DARK
  };
  function extractNameFromPath(path) {
    return path && path !== "root" ? path.split("/").slice(-2, -1)[0] : "Root";
  }
  function formatStoreForInspectorTree(module, path) {
    return {
      id: path || "root",
      // all modules end with a `/`, we want the last segment only
      // cart/ -> cart
      // nested/cart/ -> cart
      label: extractNameFromPath(path),
      tags: module.namespaced ? [TAG_NAMESPACED] : [],
      children: Object.keys(module._children).map(
        function(moduleName) {
          return formatStoreForInspectorTree(
            module._children[moduleName],
            path + moduleName + "/"
          );
        }
      )
    };
  }
  function flattenStoreForInspectorTree(result, module, filter, path) {
    if (path.includes(filter)) {
      result.push({
        id: path || "root",
        label: path.endsWith("/") ? path.slice(0, path.length - 1) : path || "Root",
        tags: module.namespaced ? [TAG_NAMESPACED] : []
      });
    }
    Object.keys(module._children).forEach(function(moduleName) {
      flattenStoreForInspectorTree(result, module._children[moduleName], filter, path + moduleName + "/");
    });
  }
  function formatStoreForInspectorState(module, getters, path) {
    getters = path === "root" ? getters : getters[path];
    var gettersKeys = Object.keys(getters);
    var storeState = {
      state: Object.keys(module.state).map(function(key) {
        return {
          key,
          editable: true,
          value: module.state[key]
        };
      })
    };
    if (gettersKeys.length) {
      var tree = transformPathsToObjectTree(getters);
      storeState.getters = Object.keys(tree).map(function(key) {
        return {
          key: key.endsWith("/") ? extractNameFromPath(key) : key,
          editable: false,
          value: canThrow(function() {
            return tree[key];
          })
        };
      });
    }
    return storeState;
  }
  function transformPathsToObjectTree(getters) {
    var result = {};
    Object.keys(getters).forEach(function(key) {
      var path = key.split("/");
      if (path.length > 1) {
        var target = result;
        var leafKey = path.pop();
        path.forEach(function(p) {
          if (!target[p]) {
            target[p] = {
              _custom: {
                value: {},
                display: p,
                tooltip: "Module",
                abstract: true
              }
            };
          }
          target = target[p]._custom.value;
        });
        target[leafKey] = canThrow(function() {
          return getters[key];
        });
      } else {
        result[key] = canThrow(function() {
          return getters[key];
        });
      }
    });
    return result;
  }
  function getStoreModule(moduleMap, path) {
    var names = path.split("/").filter(function(n) {
      return n;
    });
    return names.reduce(
      function(module, moduleName, i) {
        var child = module[moduleName];
        if (!child) {
          throw new Error('Missing module "' + moduleName + '" for path "' + path + '".');
        }
        return i === names.length - 1 ? child : child._children;
      },
      path === "root" ? moduleMap : moduleMap.root._children
    );
  }
  function canThrow(cb) {
    try {
      return cb();
    } catch (e) {
      return e;
    }
  }
  var Module = function Module2(rawModule, runtime) {
    this.runtime = runtime;
    this._children = /* @__PURE__ */ Object.create(null);
    this._rawModule = rawModule;
    var rawState = rawModule.state;
    this.state = (typeof rawState === "function" ? rawState() : rawState) || {};
  };
  var prototypeAccessors$1 = { namespaced: { configurable: true } };
  prototypeAccessors$1.namespaced.get = function() {
    return !!this._rawModule.namespaced;
  };
  Module.prototype.addChild = function addChild(key, module) {
    this._children[key] = module;
  };
  Module.prototype.removeChild = function removeChild(key) {
    delete this._children[key];
  };
  Module.prototype.getChild = function getChild(key) {
    return this._children[key];
  };
  Module.prototype.hasChild = function hasChild(key) {
    return key in this._children;
  };
  Module.prototype.update = function update2(rawModule) {
    this._rawModule.namespaced = rawModule.namespaced;
    if (rawModule.actions) {
      this._rawModule.actions = rawModule.actions;
    }
    if (rawModule.mutations) {
      this._rawModule.mutations = rawModule.mutations;
    }
    if (rawModule.getters) {
      this._rawModule.getters = rawModule.getters;
    }
  };
  Module.prototype.forEachChild = function forEachChild(fn) {
    forEachValue(this._children, fn);
  };
  Module.prototype.forEachGetter = function forEachGetter(fn) {
    if (this._rawModule.getters) {
      forEachValue(this._rawModule.getters, fn);
    }
  };
  Module.prototype.forEachAction = function forEachAction(fn) {
    if (this._rawModule.actions) {
      forEachValue(this._rawModule.actions, fn);
    }
  };
  Module.prototype.forEachMutation = function forEachMutation(fn) {
    if (this._rawModule.mutations) {
      forEachValue(this._rawModule.mutations, fn);
    }
  };
  Object.defineProperties(Module.prototype, prototypeAccessors$1);
  var ModuleCollection = function ModuleCollection2(rawRootModule) {
    this.register([], rawRootModule, false);
  };
  ModuleCollection.prototype.get = function get(path) {
    return path.reduce(function(module, key) {
      return module.getChild(key);
    }, this.root);
  };
  ModuleCollection.prototype.getNamespace = function getNamespace(path) {
    var module = this.root;
    return path.reduce(function(namespace, key) {
      module = module.getChild(key);
      return namespace + (module.namespaced ? key + "/" : "");
    }, "");
  };
  ModuleCollection.prototype.update = function update$1(rawRootModule) {
    update([], this.root, rawRootModule);
  };
  ModuleCollection.prototype.register = function register(path, rawModule, runtime) {
    var this$1$1 = this;
    if (runtime === void 0)
      runtime = true;
    {
      assertRawModule(path, rawModule);
    }
    var newModule = new Module(rawModule, runtime);
    if (path.length === 0) {
      this.root = newModule;
    } else {
      var parent = this.get(path.slice(0, -1));
      parent.addChild(path[path.length - 1], newModule);
    }
    if (rawModule.modules) {
      forEachValue(rawModule.modules, function(rawChildModule, key) {
        this$1$1.register(path.concat(key), rawChildModule, runtime);
      });
    }
  };
  ModuleCollection.prototype.unregister = function unregister(path) {
    var parent = this.get(path.slice(0, -1));
    var key = path[path.length - 1];
    var child = parent.getChild(key);
    if (!child) {
      {
        console.warn(
          "[vuex] trying to unregister module '" + key + "', which is not registered"
        );
      }
      return;
    }
    if (!child.runtime) {
      return;
    }
    parent.removeChild(key);
  };
  ModuleCollection.prototype.isRegistered = function isRegistered(path) {
    var parent = this.get(path.slice(0, -1));
    var key = path[path.length - 1];
    if (parent) {
      return parent.hasChild(key);
    }
    return false;
  };
  function update(path, targetModule, newModule) {
    {
      assertRawModule(path, newModule);
    }
    targetModule.update(newModule);
    if (newModule.modules) {
      for (var key in newModule.modules) {
        if (!targetModule.getChild(key)) {
          {
            console.warn(
              "[vuex] trying to add a new module '" + key + "' on hot reloading, manual reload is needed"
            );
          }
          return;
        }
        update(
          path.concat(key),
          targetModule.getChild(key),
          newModule.modules[key]
        );
      }
    }
  }
  var functionAssert = {
    assert: function(value) {
      return typeof value === "function";
    },
    expected: "function"
  };
  var objectAssert = {
    assert: function(value) {
      return typeof value === "function" || typeof value === "object" && typeof value.handler === "function";
    },
    expected: 'function or object with "handler" function'
  };
  var assertTypes = {
    getters: functionAssert,
    mutations: functionAssert,
    actions: objectAssert
  };
  function assertRawModule(path, rawModule) {
    Object.keys(assertTypes).forEach(function(key) {
      if (!rawModule[key]) {
        return;
      }
      var assertOptions2 = assertTypes[key];
      forEachValue(rawModule[key], function(value, type) {
        assert(
          assertOptions2.assert(value),
          makeAssertionMessage(path, key, type, value, assertOptions2.expected)
        );
      });
    });
  }
  function makeAssertionMessage(path, key, type, value, expected) {
    var buf = key + " should be " + expected + ' but "' + key + "." + type + '"';
    if (path.length > 0) {
      buf += ' in module "' + path.join(".") + '"';
    }
    buf += " is " + JSON.stringify(value) + ".";
    return buf;
  }
  function createStore(options) {
    return new Store(options);
  }
  var Store = function Store2(options) {
    var this$1$1 = this;
    if (options === void 0)
      options = {};
    {
      assert(typeof Promise !== "undefined", "vuex requires a Promise polyfill in this browser.");
      assert(this instanceof Store2, "store must be called with the new operator.");
    }
    var plugins = options.plugins;
    if (plugins === void 0)
      plugins = [];
    var strict = options.strict;
    if (strict === void 0)
      strict = false;
    var devtools = options.devtools;
    this._committing = false;
    this._actions = /* @__PURE__ */ Object.create(null);
    this._actionSubscribers = [];
    this._mutations = /* @__PURE__ */ Object.create(null);
    this._wrappedGetters = /* @__PURE__ */ Object.create(null);
    this._modules = new ModuleCollection(options);
    this._modulesNamespaceMap = /* @__PURE__ */ Object.create(null);
    this._subscribers = [];
    this._makeLocalGettersCache = /* @__PURE__ */ Object.create(null);
    this._scope = null;
    this._devtools = devtools;
    var store2 = this;
    var ref = this;
    var dispatch = ref.dispatch;
    var commit = ref.commit;
    this.dispatch = function boundDispatch(type, payload) {
      return dispatch.call(store2, type, payload);
    };
    this.commit = function boundCommit(type, payload, options2) {
      return commit.call(store2, type, payload, options2);
    };
    this.strict = strict;
    var state = this._modules.root.state;
    installModule(this, state, [], this._modules.root);
    resetStoreState(this, state);
    plugins.forEach(function(plugin) {
      return plugin(this$1$1);
    });
  };
  var prototypeAccessors = { state: { configurable: true } };
  Store.prototype.install = function install(app, injectKey) {
    app.provide(injectKey || storeKey, this);
    app.config.globalProperties.$store = this;
    var useDevtools = this._devtools !== void 0 ? this._devtools : true;
    if (useDevtools) {
      addDevtools(app, this);
    }
  };
  prototypeAccessors.state.get = function() {
    return this._state.data;
  };
  prototypeAccessors.state.set = function(v) {
    {
      assert(false, "use store.replaceState() to explicit replace store state.");
    }
  };
  Store.prototype.commit = function commit(_type, _payload, _options) {
    var this$1$1 = this;
    var ref = unifyObjectStyle(_type, _payload, _options);
    var type = ref.type;
    var payload = ref.payload;
    var options = ref.options;
    var mutation = { type, payload };
    var entry = this._mutations[type];
    if (!entry) {
      {
        console.error("[vuex] unknown mutation type: " + type);
      }
      return;
    }
    this._withCommit(function() {
      entry.forEach(function commitIterator(handler) {
        handler(payload);
      });
    });
    this._subscribers.slice().forEach(function(sub) {
      return sub(mutation, this$1$1.state);
    });
    if (options && options.silent) {
      console.warn(
        "[vuex] mutation type: " + type + ". Silent option has been removed. Use the filter functionality in the vue-devtools"
      );
    }
  };
  Store.prototype.dispatch = function dispatch(_type, _payload) {
    var this$1$1 = this;
    var ref = unifyObjectStyle(_type, _payload);
    var type = ref.type;
    var payload = ref.payload;
    var action = { type, payload };
    var entry = this._actions[type];
    if (!entry) {
      {
        console.error("[vuex] unknown action type: " + type);
      }
      return;
    }
    try {
      this._actionSubscribers.slice().filter(function(sub) {
        return sub.before;
      }).forEach(function(sub) {
        return sub.before(action, this$1$1.state);
      });
    } catch (e) {
      {
        console.warn("[vuex] error in before action subscribers: ");
        console.error(e);
      }
    }
    var result = entry.length > 1 ? Promise.all(entry.map(function(handler) {
      return handler(payload);
    })) : entry[0](payload);
    return new Promise(function(resolve, reject) {
      result.then(function(res) {
        try {
          this$1$1._actionSubscribers.filter(function(sub) {
            return sub.after;
          }).forEach(function(sub) {
            return sub.after(action, this$1$1.state);
          });
        } catch (e) {
          {
            console.warn("[vuex] error in after action subscribers: ");
            console.error(e);
          }
        }
        resolve(res);
      }, function(error2) {
        try {
          this$1$1._actionSubscribers.filter(function(sub) {
            return sub.error;
          }).forEach(function(sub) {
            return sub.error(action, this$1$1.state, error2);
          });
        } catch (e) {
          {
            console.warn("[vuex] error in error action subscribers: ");
            console.error(e);
          }
        }
        reject(error2);
      });
    });
  };
  Store.prototype.subscribe = function subscribe(fn, options) {
    return genericSubscribe(fn, this._subscribers, options);
  };
  Store.prototype.subscribeAction = function subscribeAction(fn, options) {
    var subs = typeof fn === "function" ? { before: fn } : fn;
    return genericSubscribe(subs, this._actionSubscribers, options);
  };
  Store.prototype.watch = function watch$1(getter, cb, options) {
    var this$1$1 = this;
    {
      assert(typeof getter === "function", "store.watch only accepts a function.");
    }
    return vue.watch(function() {
      return getter(this$1$1.state, this$1$1.getters);
    }, cb, Object.assign({}, options));
  };
  Store.prototype.replaceState = function replaceState(state) {
    var this$1$1 = this;
    this._withCommit(function() {
      this$1$1._state.data = state;
    });
  };
  Store.prototype.registerModule = function registerModule(path, rawModule, options) {
    if (options === void 0)
      options = {};
    if (typeof path === "string") {
      path = [path];
    }
    {
      assert(Array.isArray(path), "module path must be a string or an Array.");
      assert(path.length > 0, "cannot register the root module by using registerModule.");
    }
    this._modules.register(path, rawModule);
    installModule(this, this.state, path, this._modules.get(path), options.preserveState);
    resetStoreState(this, this.state);
  };
  Store.prototype.unregisterModule = function unregisterModule(path) {
    var this$1$1 = this;
    if (typeof path === "string") {
      path = [path];
    }
    {
      assert(Array.isArray(path), "module path must be a string or an Array.");
    }
    this._modules.unregister(path);
    this._withCommit(function() {
      var parentState = getNestedState(this$1$1.state, path.slice(0, -1));
      delete parentState[path[path.length - 1]];
    });
    resetStore(this);
  };
  Store.prototype.hasModule = function hasModule(path) {
    if (typeof path === "string") {
      path = [path];
    }
    {
      assert(Array.isArray(path), "module path must be a string or an Array.");
    }
    return this._modules.isRegistered(path);
  };
  Store.prototype.hotUpdate = function hotUpdate(newOptions) {
    this._modules.update(newOptions);
    resetStore(this, true);
  };
  Store.prototype._withCommit = function _withCommit(fn) {
    var committing = this._committing;
    this._committing = true;
    fn();
    this._committing = committing;
  };
  Object.defineProperties(Store.prototype, prototypeAccessors);
  var mapState = normalizeNamespace(function(namespace, states) {
    var res = {};
    if (!isValidMap(states)) {
      console.error("[vuex] mapState: mapper parameter must be either an Array or an Object");
    }
    normalizeMap(states).forEach(function(ref) {
      var key = ref.key;
      var val = ref.val;
      res[key] = function mappedState() {
        var state = this.$store.state;
        var getters = this.$store.getters;
        if (namespace) {
          var module = getModuleByNamespace(this.$store, "mapState", namespace);
          if (!module) {
            return;
          }
          state = module.context.state;
          getters = module.context.getters;
        }
        return typeof val === "function" ? val.call(this, state, getters) : state[val];
      };
      res[key].vuex = true;
    });
    return res;
  });
  function normalizeMap(map) {
    if (!isValidMap(map)) {
      return [];
    }
    return Array.isArray(map) ? map.map(function(key) {
      return { key, val: key };
    }) : Object.keys(map).map(function(key) {
      return { key, val: map[key] };
    });
  }
  function isValidMap(map) {
    return Array.isArray(map) || isObject$1(map);
  }
  function normalizeNamespace(fn) {
    return function(namespace, map) {
      if (typeof namespace !== "string") {
        map = namespace;
        namespace = "";
      } else if (namespace.charAt(namespace.length - 1) !== "/") {
        namespace += "/";
      }
      return fn(namespace, map);
    };
  }
  function getModuleByNamespace(store2, helper, namespace) {
    var module = store2._modulesNamespaceMap[namespace];
    if (!module) {
      console.error("[vuex] module namespace not found in " + helper + "(): " + namespace);
    }
    return module;
  }
  const store = createStore({
    state: {
      //防止调试时刷新页面重置vuex中数据
      isLoggedIn: uni.getStorageSync("isLoggedIn") || false,
      //用户是否登录
      userdata: {},
      //用户数据
      token: uni.getStorageSync("token")
    },
    //mutations定义同步操作的方法
    mutations: {
      setAvatar(state, url2) {
        state.userdata.headImg = url2;
      },
      //设置登录
      setLoggedIn(state) {
        state.isLoggedIn = true;
        uni.setStorageSync("isLoggedIn", state.isLoggedIn);
        formatAppLog("log", "at store/index.js:21", "登录状态：", state.isLoggedIn);
      },
      //存token
      setToken(state, token) {
        state.token = token;
        uni.setStorageSync("token", token);
        formatAppLog("log", "at store/index.js:28", "token已保存：", token);
      },
      //登录
      login(state, userdata) {
        state.userdata = userdata;
        formatAppLog("log", "at store/index.js:33", typeof userdata, userdata);
        uni.setStorageSync("userdata", JSON.stringify(userdata));
        formatAppLog("log", "at store/index.js:35", "登录信息:", state.userdata);
      },
      // 退出登录
      logout(state) {
        state.isLoggedIn = false;
        state.userdata = {};
        state.token = "";
        uni.removeStorageSync("userdata");
        uni.removeStorageSync("token");
        uni.setStorageSync("isLoggedIn", false);
        formatAppLog("log", "at store/index.js:46", "已退出登录");
        formatAppLog("log", "at store/index.js:47", "token：", state.token);
        formatAppLog("log", "at store/index.js:48", "登录信息", uni.getStorageSync("userdata"));
      }
    },
    actions: {}
  });
  const _imports_0$1 = "/static/image/symple/search-blue.png";
  const _export_sfc = (sfc, props2) => {
    const target = sfc.__vccOpts || sfc;
    for (const [key, val] of props2) {
      target[key] = val;
    }
    return target;
  };
  const _sfc_main$e = {
    name: "topSearchAndLogin",
    props: ["textMsg"],
    data() {
      return {
        defaultAvatarUrl: "/static/image/resource/basepage-defaultAvatar.png"
      };
    },
    computed: mapState({
      // 从state中拿到数据 箭头函数可使代码更简练
      isLoggedIn: (state) => state.isLoggedIn,
      userAvatar: (state) => state.userdata.headImg
    }),
    methods: {
      goToMine() {
        uni.switchTab({
          url: "/pages/mine/mine"
        });
      },
      // 未登录状态点击头像跳转到登录页面
      goToLogin() {
        uni.navigateTo({
          url: "/pages/index_login/index_login"
        });
      }
    }
  };
  function _sfc_render$d(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("view", { class: "top-tab" }, [
      vue.createElementVNode("view", { class: "attendance" }, [
        vue.createElementVNode("button", { class: "attendance-button" }, "签到打卡")
      ]),
      vue.createElementVNode("view", { class: "search" }, [
        vue.createElementVNode("image", {
          class: "search-img",
          src: _imports_0$1,
          mode: "aspectFit"
        }),
        vue.createElementVNode("input", {
          class: "search-input",
          type: "text",
          placeholder: "搜索内容"
        })
      ]),
      vue.createElementVNode("view", { class: "log-in" }, [
        _ctx.isLoggedIn ? (vue.openBlock(), vue.createElementBlock("view", { key: 0 }, [
          vue.createCommentVNode(" 如果已登录，显示用户头像 "),
          vue.createElementVNode("image", {
            class: "log-in-avatar",
            src: _ctx.userAvatar ? _ctx.userAvatar : $data.defaultAvatarUrl,
            onClick: _cache[0] || (_cache[0] = (...args) => $options.goToMine && $options.goToMine(...args)),
            mode: "scaleToFill"
          }, null, 8, ["src"])
        ])) : (vue.openBlock(), vue.createElementBlock("view", { key: 1 }, [
          vue.createCommentVNode(" 如果未登录，显示登录按钮 "),
          vue.createElementVNode(
            "button",
            {
              class: "log-in-button",
              onClick: _cache[1] || (_cache[1] = (...args) => $options.goToLogin && $options.goToLogin(...args))
            },
            vue.toDisplayString($props.textMsg),
            1
            /* TEXT */
          )
        ]))
      ])
    ]);
  }
  const topSearchAndLogin = /* @__PURE__ */ _export_sfc(_sfc_main$e, [["render", _sfc_render$d], ["__scopeId", "data-v-b2b2856f"], ["__file", "E:/HBuilderX/Program_files/knowledge-uniapp/src/components/topSearchAndLogin.vue"]]);
  const _sfc_main$d = {
    components: {
      topSearchAndLogin
    },
    data() {
      return {
        //传到顶部子组件的数据
        // loginInfo: {
        // 	isLoggedIn: false,
        // 	userAvatar: '../../static/image/resource/basepage-defaultAvatar.png', // 默认用户头像地址
        // },
        //顶部滑动大图数据
        topTitle: "登录",
        topUrlList: [
          "../../static/image/logo/logo.png",
          "../../static/image/resource/basepage-top.png",
          "../../static/image/resource/basepage-top.png"
        ],
        bottomList1: [
          {
            image: "../../static/image/logo/logo.png",
            text: "赛代表大撒大撒"
          },
          {
            image: "../../static/image/logo/logo.png",
            text: "1235432"
          },
          {
            image: "../../static/image/logo/logo.png",
            text: "你说什么"
          },
          {
            image: "../../static/image/logo/logo.png",
            text: "不知道不知道不知道"
          }
        ]
      };
    },
    // onLoad() {
    // 	var token = this.$store.state.token;
    // 	__f__('log','at pages/basefunction/basefunction.vue:155',"token：", token);
    // },
    onShow() {
    },
    methods: {}
  };
  function _sfc_render$c(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_topSearchAndLogin = vue.resolveComponent("topSearchAndLogin");
    return vue.openBlock(), vue.createElementBlock(
      vue.Fragment,
      null,
      [
        vue.createElementVNode("view", { class: "top-img" }, [
          vue.createElementVNode("image", {
            class: "img",
            src: "/static/image/background/bg-basefunction-top.png",
            mode: "scaleToFill"
          })
        ]),
        vue.createElementVNode("view", { class: "status_bar" }, [
          vue.createCommentVNode(" 这里是状态栏 ")
        ]),
        vue.createVNode(_component_topSearchAndLogin, { textMsg: $data.topTitle }, null, 8, ["textMsg"]),
        vue.createElementVNode("view", { class: "top-swiper-section" }, [
          vue.createElementVNode("swiper", {
            class: "swiper",
            "indicator-color": "white",
            "indicator-active-color": "#FFDE89",
            "indicator-dots": true,
            autoplay: true,
            interval: 3e3,
            duration: 1e3,
            circular: true
          }, [
            (vue.openBlock(true), vue.createElementBlock(
              vue.Fragment,
              null,
              vue.renderList($data.topUrlList, (url2, index2) => {
                return vue.openBlock(), vue.createElementBlock("swiper-item", {
                  key: index2,
                  class: "swiper-img"
                }, [
                  vue.createElementVNode("image", {
                    src: url2,
                    style: { "height": "100%", "width": "96%" },
                    mode: "scaleToFill"
                  }, null, 8, ["src"])
                ]);
              }),
              128
              /* KEYED_FRAGMENT */
            ))
          ])
        ]),
        vue.createElementVNode("view", { style: { "display": "flex", "justify-content": "center" } }, [
          vue.createElementVNode("view", { class: "four-button" }, [
            vue.createElementVNode("view", { class: "four-button-item" }, [
              vue.createElementVNode("image", {
                class: "four-button-item-img",
                src: "/static/image/resource/basepage-psycho.png",
                mode: ""
              }),
              vue.createElementVNode("text", null, "心理")
            ]),
            vue.createElementVNode("view", { class: "four-button-item" }, [
              vue.createElementVNode("image", {
                class: "four-button-item-img",
                src: "/static/image/resource/basepage-paper.png",
                mode: ""
              }),
              vue.createElementVNode("text", null, "随机组卷")
            ]),
            vue.createElementVNode("view", { class: "four-button-item" }, [
              vue.createElementVNode("image", {
                class: "four-button-item-img",
                src: "/static/image/resource/basepage-search.png",
                mode: ""
              }),
              vue.createElementVNode("text", null, "题库检索")
            ]),
            vue.createElementVNode("view", { class: "four-button-item" }, [
              vue.createElementVNode("image", {
                class: "four-button-item-img",
                src: "/static/image/resource/basepage-analysis.png",
                mode: ""
              }),
              vue.createElementVNode("text", null, "数据分析")
            ])
          ])
        ]),
        vue.createElementVNode("view", { class: "goto-notebook" }, [
          vue.createElementVNode("image", {
            class: "goto-notebook-bg",
            src: "/static/image/background/bg-notebook.png",
            mode: ""
          }),
          vue.createElementVNode("button", { class: "goto-notebook-button" }, [
            vue.createElementVNode("text", null, "GO")
          ])
        ]),
        vue.createElementVNode("view", { class: "detail-section" }, [
          vue.createCommentVNode(" 学长学姐说 "),
          vue.createElementVNode("view", { class: "detail-section-item" }, [
            vue.createElementVNode("view", { class: "title" }, [
              vue.createElementVNode("view", { class: "title-start" }, [
                vue.createElementVNode("image", {
                  class: "title-start-img",
                  src: "/static/image/resource/basepage-swiper-1.png",
                  mode: ""
                }),
                vue.createElementVNode("text", { class: "title-start-text" }, "学长学姐说")
              ]),
              vue.createElementVNode("view", { class: "title-end" }, [
                vue.createElementVNode("text", { class: "title-end-text" }, "更多"),
                vue.createElementVNode("image", {
                  class: "title-end-img",
                  src: "/static/image/symple/more-right.png",
                  mode: ""
                })
              ])
            ]),
            vue.createElementVNode("swiper", {
              class: "swiper-list",
              autoplay: false,
              "indicator-dots": false,
              "display-multiple-items": 3
            }, [
              (vue.openBlock(true), vue.createElementBlock(
                vue.Fragment,
                null,
                vue.renderList($data.bottomList1, (item, index2) => {
                  return vue.openBlock(), vue.createElementBlock("swiper-item", {
                    key: index2,
                    class: "swiper-list-item"
                  }, [
                    vue.createElementVNode("image", {
                      class: "swiper-list-item-img",
                      src: item.image,
                      mode: "scaleToFill"
                    }, null, 8, ["src"]),
                    vue.createElementVNode(
                      "text",
                      { class: "swiper-list-item-text" },
                      vue.toDisplayString(item.text),
                      1
                      /* TEXT */
                    )
                  ]);
                }),
                128
                /* KEYED_FRAGMENT */
              ))
            ])
          ]),
          vue.createCommentVNode(" 小伙伴说 "),
          vue.createElementVNode("view", { class: "detail-section-item" }, [
            vue.createElementVNode("view", { class: "title" }, [
              vue.createElementVNode("view", { class: "title-start" }, [
                vue.createElementVNode("image", {
                  class: "title-start-img",
                  src: "/static/image/resource/basepage-swiper-2.png",
                  mode: ""
                }),
                vue.createElementVNode("text", { class: "title-start-text" }, "小伙伴说")
              ]),
              vue.createElementVNode("view", { class: "title-end" }, [
                vue.createElementVNode("text", { class: "title-end-text" }, "更多"),
                vue.createElementVNode("image", {
                  class: "title-end-img",
                  src: "/static/image/symple/more-right.png",
                  mode: ""
                })
              ])
            ]),
            vue.createElementVNode("swiper", {
              class: "swiper-list",
              autoplay: false,
              "indicator-dots": false,
              "display-multiple-items": 3
            }, [
              (vue.openBlock(true), vue.createElementBlock(
                vue.Fragment,
                null,
                vue.renderList($data.bottomList1, (item, index2) => {
                  return vue.openBlock(), vue.createElementBlock("swiper-item", {
                    key: index2,
                    class: "swiper-list-item"
                  }, [
                    vue.createElementVNode("image", {
                      class: "swiper-list-item-img",
                      src: item.image,
                      mode: "scaleToFill"
                    }, null, 8, ["src"]),
                    vue.createElementVNode(
                      "text",
                      { class: "swiper-list-item-text" },
                      vue.toDisplayString(item.text),
                      1
                      /* TEXT */
                    )
                  ]);
                }),
                128
                /* KEYED_FRAGMENT */
              ))
            ])
          ]),
          vue.createCommentVNode(" 趣味知识 "),
          vue.createElementVNode("view", { class: "detail-section-item" }, [
            vue.createElementVNode("view", { class: "title" }, [
              vue.createElementVNode("view", { class: "title-start" }, [
                vue.createElementVNode("image", {
                  class: "title-start-img",
                  src: "/static/image/resource/basepage-swiper-3.png",
                  mode: ""
                }),
                vue.createElementVNode("text", { class: "title-start-text" }, "趣味知识")
              ]),
              vue.createElementVNode("view", { class: "title-end" }, [
                vue.createElementVNode("text", { class: "title-end-text" }, "更多"),
                vue.createElementVNode("image", {
                  class: "title-end-img",
                  src: "/static/image/symple/more-right.png",
                  mode: ""
                })
              ])
            ]),
            vue.createElementVNode("swiper", {
              class: "swiper-list",
              autoplay: false,
              "indicator-dots": false,
              "display-multiple-items": 3
            }, [
              (vue.openBlock(true), vue.createElementBlock(
                vue.Fragment,
                null,
                vue.renderList($data.bottomList1, (item, index2) => {
                  return vue.openBlock(), vue.createElementBlock("swiper-item", {
                    key: index2,
                    class: "swiper-list-item"
                  }, [
                    vue.createElementVNode("image", {
                      class: "swiper-list-item-img",
                      src: item.image,
                      mode: "scaleToFill"
                    }, null, 8, ["src"]),
                    vue.createElementVNode(
                      "text",
                      { class: "swiper-list-item-text" },
                      vue.toDisplayString(item.text),
                      1
                      /* TEXT */
                    )
                  ]);
                }),
                128
                /* KEYED_FRAGMENT */
              ))
            ])
          ])
        ])
      ],
      64
      /* STABLE_FRAGMENT */
    );
  }
  const PagesBasefunctionBasefunction = /* @__PURE__ */ _export_sfc(_sfc_main$d, [["render", _sfc_render$c], ["__file", "E:/HBuilderX/Program_files/knowledge-uniapp/src/pages/basefunction/basefunction.vue"]]);
  const _sfc_main$c = {
    data() {
      return {
        title: "Hello",
        xieyichecked: false
      };
    },
    onLoad() {
      var token = this.$store.state.token;
      formatAppLog("log", "at pages/index_login/index_login.vue:68", "token:", token);
    },
    methods: {
      //检查是否勾选协议
      xieyiConfirm() {
        this.xieyichecked = !this.xieyichecked;
        formatAppLog("log", "at pages/index_login/index_login.vue:74", this.xieyichecked);
      },
      goLogin1() {
        formatAppLog("log", "at pages/index_login/index_login.vue:77", "到登录页面1");
        uni.navigateTo({
          url: "../login/login"
        });
      }
    }
  };
  function _sfc_render$b(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock(
      vue.Fragment,
      null,
      [
        vue.createCommentVNode(" 主页 分成三部分 logo部分 中间部分 底部协议"),
        vue.createElementVNode("view", { class: "page" }, [
          vue.createElementVNode("view", { class: "logo" }, [
            vue.createElementVNode("image", {
              class: "logo-img",
              src: "/static/image/logo/logo-dark.png",
              mode: "aspectFit"
            }),
            vue.createElementVNode("text", { style: { "margin-top": "6px" } }, " 儒升 ")
          ]),
          vue.createElementVNode("view", { class: "signin-section" }, [
            vue.createElementVNode("view", { class: "button-section" }, [
              vue.createElementVNode("view", { class: "sign-in-wx" }, [
                vue.createElementVNode("button", {
                  class: "wx-in",
                  onClick: _cache[0] || (_cache[0] = ($event) => _ctx.goTo1())
                }, [
                  vue.createElementVNode("image", {
                    src: "/static/image/logo/wx-logo-light.png",
                    style: { "height": "20px", "width": "20px", "align-self": "center", "margin-right": "6px" },
                    mode: ""
                  }),
                  vue.createElementVNode("text", null, "微信登录")
                ])
              ]),
              vue.createElementVNode("view", { class: "sign-in-phonenum" }, [
                vue.createElementVNode("button", {
                  class: "phonenum-in",
                  onClick: _cache[1] || (_cache[1] = ($event) => $options.goLogin1())
                }, "手机号登录")
              ])
            ]),
            vue.createElementVNode("view", { class: "sign-in-account" }, [
              vue.createElementVNode("text", {
                onClick: _cache[2] || (_cache[2] = ($event) => $options.goLogin1())
              }, "账号密码登录")
            ]),
            vue.createElementVNode("view", { class: "otherway-sign-in" }, [
              vue.createElementVNode("view", { class: "split-line" }, " — 其他登录方式 — "),
              vue.createElementVNode("view", { class: "other-way" }, [
                vue.createElementVNode("view", { class: "other-way-img" }, [
                  vue.createElementVNode("image", {
                    style: { "height": "25px", "width": "25px" },
                    src: "/static/image/logo/wx-logo-raw.png",
                    mode: "aspectFit"
                  })
                ]),
                vue.createElementVNode("view", { class: "other-way-img" }, [
                  vue.createElementVNode("image", {
                    style: { "height": "24px", "width": "24px" },
                    src: "/static/image/logo/qq-logo-raw.png",
                    mode: "aspectFit"
                  })
                ]),
                vue.createElementVNode("view", { class: "other-way-img" }, [
                  vue.createElementVNode("image", {
                    style: { "height": "22px", "width": "22px", "margin-top": "-5px" },
                    src: "/static/image/logo/apple-logo-raw.png",
                    mode: "aspectFit"
                  })
                ])
              ])
            ])
          ]),
          vue.createElementVNode("view", { class: "xieyi-section" }, [
            vue.createElementVNode("label", null, [
              vue.createElementVNode("checkbox", {
                onClick: _cache[3] || (_cache[3] = ($event) => $options.xieyiConfirm()),
                value: "cb",
                color: "white",
                activeBackgroundColor: "blue",
                style: { "transform": "scale(0.7)" }
              }),
              vue.createElementVNode("text", null, "我已阅读并同意《学智通用户协议》 《隐私协议》《支付协议》")
            ])
          ])
        ])
      ],
      2112
      /* STABLE_FRAGMENT, DEV_ROOT_FRAGMENT */
    );
  }
  const PagesIndex_loginIndex_login = /* @__PURE__ */ _export_sfc(_sfc_main$c, [["render", _sfc_render$b], ["__file", "E:/HBuilderX/Program_files/knowledge-uniapp/src/pages/index_login/index_login.vue"]]);
  const _sfc_main$b = {
    data() {
      return {
        user: {
          //测试号码17315718923,用户名11,密码11
          //15805293579,用户名sdzsdzsdz2,密码12345678
          usernameOrPhone: "",
          password: ""
        },
        passwordVisible: false
        //密码是否可见
      };
    },
    onLoad() {
      formatAppLog("log", "at pages/login/login.vue:93", "密码状态", this.passwordVisible);
    },
    methods: {
      //设置密码可见状态
      togglePasswordVisibility() {
        this.passwordVisible = !this.passwordVisible;
        formatAppLog("log", "at pages/login/login.vue:99", "密码状态", this.passwordVisible);
      },
      async onSubmit(values) {
        if (this.user.usernameOrPhone.length == 0 || this.user.password == 0) {
          uni.showToast({
            title: "输入的手机号或密码不能为空！",
            icon: "error",
            position: "top"
          });
          return;
        }
        uni.showLoading({
          title: "登录中",
          mask: true
        });
        this.$service.post("/user-service/api/auth/login", {
          usernameOrPhone: this.user.usernameOrPhone,
          password: this.user.password
        }).then((res) => {
          formatAppLog("log", "at pages/login/login.vue:124", "登录信息：", res);
          if (res.data.isSuccess == 1) {
            var token = res.data.data.token;
            store.commit("setToken", token);
            store.commit("setLoggedIn");
            uni.showToast({
              title: "登录成功！",
              icon: "success"
            });
            this.setUserInfo();
            setTimeout(() => {
              uni.switchTab({
                url: "/pages/basefunction/basefunction"
              });
            }, 500);
          } else {
            uni.showToast({
              title: res.data.message,
              icon: "none",
              duration: 2e3
            });
          }
        }).catch((err) => {
          formatAppLog("log", "at pages/login/login.vue:153", err);
          uni.showToast({
            title: "网络错误，请重试",
            icon: "none",
            duration: 2e3
          });
        }).finally(() => {
          uni.hideLoading();
        });
      },
      // 获取用户信息
      async setUserInfo(retryCount = 3) {
        try {
          const response2 = await this.$service.get("/user-service/api/user");
          formatAppLog("log", "at pages/login/login.vue:171", "响应信息：", response2);
          if (response2.data.isSuccess == 1) {
            const userdata = response2.data.data;
            formatAppLog("log", "at pages/login/login.vue:175", typeof userdata);
            store.commit("login", userdata);
            store.commit("setLoggedIn");
          } else {
            throw new Error("未获取到用户信息");
          }
        } catch (error2) {
          formatAppLog("log", "at pages/login/login.vue:188", "请求出错", error2);
          if (retryCount > 0) {
            formatAppLog("log", "at pages/login/login.vue:191", `尝试重新获取用户信息，剩余重试次数：${retryCount - 1}`);
            await this.setUserInfo(retryCount - 1);
          } else {
            uni.showToast({
              title: "获取用户信息失败",
              icon: "none",
              duration: 2e3
            });
          }
        }
      },
      goTores() {
        formatAppLog("log", "at pages/login/login.vue:204", "到注册页面");
        uni.navigateTo({
          url: "../register/register"
        });
      }
    }
  };
  function _sfc_render$a(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("view", { class: "page" }, [
      vue.createElementVNode("view", { class: "up-section" }, [
        vue.createElementVNode("view", { class: "up-section-text" }, [
          vue.createElementVNode("view", { class: "up-section-text-big" }, [
            vue.createElementVNode("p", { class: "big-p" }, "您好！"),
            vue.createElementVNode("p", { class: "big-p" }, "欢迎来到儒升")
          ]),
          vue.createElementVNode("view", { class: "up-section-text-small" }, " 第一代数字化知识交互学习软件(鸿蒙版) ")
        ]),
        vue.createElementVNode("view", { class: "logo-section" }, [
          vue.createElementVNode("image", {
            style: { "height": "48vw" },
            src: "/static/image/logo/logo-light.png",
            alt: "",
            mode: "aspectFit"
          })
        ])
      ]),
      vue.createElementVNode("view", { class: "down-section" }, [
        vue.createElementVNode("view", { class: "input-section" }, [
          vue.createElementVNode("view", { class: "phone-num" }, [
            vue.createElementVNode("view", { style: { "font-size": "20px", "font-weight": "600" } }, " 手机号 "),
            vue.createElementVNode("view", { class: "uni-input1" }, [
              vue.withDirectives(vue.createElementVNode(
                "input",
                {
                  type: "text",
                  style: { "margin-left": "7%" },
                  placeholder: "请输入您的手机号或用户名",
                  "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => $data.user.usernameOrPhone = $event)
                },
                null,
                512
                /* NEED_PATCH */
              ), [
                [vue.vModelText, $data.user.usernameOrPhone]
              ])
            ])
          ]),
          vue.createElementVNode("view", { class: "pin-code" }, [
            vue.createElementVNode("view", { style: { "font-size": "20px", "font-weight": "600" } }, " 密码 "),
            vue.createElementVNode("view", { class: "uni-input2" }, [
              vue.withDirectives(vue.createElementVNode("input", {
                password: !$data.passwordVisible,
                style: { "margin-left": "7%" },
                placeholder: "请输入您的密码",
                "onUpdate:modelValue": _cache[1] || (_cache[1] = ($event) => $data.user.password = $event)
              }, null, 8, ["password"]), [
                [vue.vModelText, $data.user.password]
              ]),
              vue.createElementVNode("view", { style: { "flex-grow": "1", "display": "flex", "justify-content": "flex-end" } }, [
                vue.createElementVNode("image", {
                  style: { "height": "18px", "width": "18px", "right": "20%" },
                  onClick: _cache[2] || (_cache[2] = (...args) => $options.togglePasswordVisibility && $options.togglePasswordVisibility(...args)),
                  src: $data.passwordVisible ? "../../static/image/symple/pin-visible.png" : "../../static/image/symple/pin-invisible.png",
                  mode: "aspectFit"
                }, null, 8, ["src"])
              ])
            ]),
            vue.createElementVNode("view", {
              class: "forget-pin",
              onClick: _cache[3] || (_cache[3] = ($event) => _ctx.goTo())
            }, "忘记密码?")
          ]),
          vue.createElementVNode("view", { class: "button-section" }, [
            vue.createElementVNode("view", { class: "sign-in" }, [
              vue.createElementVNode("button", {
                class: "bt-sign-in",
                onClick: _cache[4] || (_cache[4] = (...args) => $options.onSubmit && $options.onSubmit(...args))
              }, "登录")
            ]),
            vue.createElementVNode("view", { class: "sign-up" }, [
              vue.createElementVNode("button", {
                class: "bt-sign-up",
                onClick: _cache[5] || (_cache[5] = ($event) => $options.goTores())
              }, "注册")
            ])
          ]),
          vue.createElementVNode("view", { class: "otherway-sign-in" }, [
            vue.createElementVNode("view", { class: "other-way" }, [
              vue.createElementVNode("view", { class: "other-way-img" }, [
                vue.createElementVNode("image", {
                  style: { "height": "25px", "width": "25px" },
                  src: "/static/image/logo/wx-logo-raw.png",
                  mode: "aspectFit"
                })
              ]),
              vue.createElementVNode("view", { class: "other-way-img" }, [
                vue.createElementVNode("image", {
                  style: { "height": "24px", "width": "24px" },
                  src: "/static/image/logo/qq-logo-raw.png",
                  mode: "aspectFit"
                })
              ]),
              vue.createElementVNode("view", { class: "other-way-img" }, [
                vue.createElementVNode("image", {
                  style: { "height": "22px", "width": "22px", "margin-top": "-5px" },
                  src: "/static/image/logo/apple-logo-raw.png",
                  mode: "aspectFit"
                })
              ])
            ]),
            vue.createElementVNode("view", { class: "split-line" }, " — 其他登录方式 — ")
          ])
        ])
      ])
    ]);
  }
  const PagesLoginLogin = /* @__PURE__ */ _export_sfc(_sfc_main$b, [["render", _sfc_render$a], ["__file", "E:/HBuilderX/Program_files/knowledge-uniapp/src/pages/login/login.vue"]]);
  const _sfc_main$a = {
    data() {
      return {
        user: {
          username: "",
          password: "",
          vercode: "",
          phonenum: ""
        },
        phoneIstrue: 0,
        sendcode: {
          isButtonDisabled: false,
          countdown: 0
        },
        passwordVisible: false
      };
    },
    methods: {
      //设置密码可见状态
      togglePasswordVisibility() {
        this.passwordVisible = !this.passwordVisible;
        formatAppLog("log", "at pages/register/register.vue:113", "密码状态", this.passwordVisible);
      },
      registOnSubmit() {
        const requestData = {
          username: this.user.username,
          password: this.user.password,
          code: this.user.vercode,
          phone: this.user.phonenum
        };
        if (!requestData.username || !requestData.password || !requestData.code || !requestData.phone) {
          return;
        }
        this.isPhone(this.user.phonenum);
        if (this.phoneIstrue == 0) {
          uni.showToast({
            title: "请输入正确的手机号！",
            icon: "error",
            position: "top"
          });
          return;
        }
        this.$service.post("/user-service/api/auth/register", requestData).then((response2) => {
          if (response2.data.isSuccess == 1) {
            uni.showToast({
              title: "注册成功",
              icon: "success",
              duration: 2e3
            });
            this.$router.push("../login/login");
          } else {
            uni.showToast({
              title: "注册失败: " + response2.data.message,
              icon: "none",
              duration: 2200
            });
          }
        }).catch((error2) => {
          uni.showToast({
            title: "请求错误" + response.data.message,
            icon: "none",
            duration: 2e3
          });
          formatAppLog("error", "at pages/register/register.vue:165", "注册请求失败:", error2);
        });
      },
      //验证电话号码
      isPhone(phone) {
        var reg = /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/;
        if (phone.length == 11) {
          if (!reg.test(phone)) {
            this.phoneIstrue = 0;
            formatAppLog("log", "at pages/register/register.vue:174", "电话号码输入错误！");
          } else {
            this.phoneIstrue = 1;
            formatAppLog("log", "at pages/register/register.vue:177", "电话号码输入正确！");
          }
        } else {
          formatAppLog("log", "at pages/register/register.vue:180", "电话号码输入错误！");
          this.phoneIstrue = 0;
        }
      },
      //发送验证码
      async getVercode() {
        try {
          this.isPhone(this.user.phonenum);
          if (this.phoneIstrue == 0) {
            uni.showToast({
              title: "请输入正确的手机号！",
              icon: "error",
              position: "top"
            });
            return;
          }
          uni.showLoading({
            title: "加载中",
            mask: true
          });
          const response2 = await this.$service.post("/user-service/api/auth/sms", {
            phone: this.user.phonenum
          });
          if (response2.data.isSuccess == 1) {
            this.startCountdown();
            uni.showToast({
              title: "验证码已发送",
              icon: "success",
              duration: 2e3
            });
          } else {
            uni.showToast({
              title: "发送失败,请重试",
              icon: "none",
              duration: 2e3
            });
          }
        } catch (err) {
          formatAppLog("log", "at pages/register/register.vue:222", err);
          uni.showToast({
            title: "请求出错",
            icon: "none",
            duration: 2400
          });
        } finally {
          uni.hideLoading();
        }
      },
      //发送验证码间隔
      startCountdown() {
        this.sendcode.isButtonDisabled = true;
        this.sendcode.countdown = 60;
        const interval = setInterval(() => {
          this.sendcode.countdown--;
          if (this.sendcode.countdown === 0) {
            clearInterval(interval);
            this.sendcode.isButtonDisabled = false;
          }
        }, 1e3);
      }
    }
  };
  function _sfc_render$9(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("view", { class: "page" }, [
      vue.createElementVNode("view", { class: "up-section" }, [
        vue.createElementVNode("view", { class: "up-section-text" }, [
          vue.createElementVNode("view", { class: "up-section-text-big" }, [
            vue.createElementVNode("p", { class: "big-p" }, "您好！"),
            vue.createElementVNode("p", { class: "big-p" }, "欢迎来到儒升")
          ]),
          vue.createElementVNode("view", { class: "up-section-text-small" }, " 第一代数字化知识交互学习软件(鸿蒙版) ")
        ]),
        vue.createElementVNode("view", { class: "logo-section" }, [
          vue.createElementVNode("image", {
            style: { "height": "48vw" },
            src: "/static/image/logo/logo-light.png",
            alt: "",
            mode: "aspectFit"
          })
        ])
      ]),
      vue.createElementVNode("view", { class: "down-section" }, [
        vue.createElementVNode("view", { class: "input-section" }, [
          vue.createElementVNode("view", { class: "user-name" }, [
            vue.createElementVNode("view", { style: { "font-size": "20px", "font-weight": "600" } }, " 用户名 "),
            vue.createElementVNode("view", { class: "uni-input1" }, [
              vue.withDirectives(vue.createElementVNode(
                "input",
                {
                  style: { "margin-left": "7%" },
                  placeholder: "请输入您的用户名",
                  "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => $data.user.username = $event)
                },
                null,
                512
                /* NEED_PATCH */
              ), [
                [vue.vModelText, $data.user.username]
              ])
            ])
          ]),
          vue.createElementVNode("view", { class: "pass-word" }, [
            vue.createElementVNode("view", { style: { "margin-top": "15px", "font-size": "20px", "font-weight": "600" } }, " 密码 "),
            vue.createElementVNode("view", { class: "uni-input2" }, [
              vue.withDirectives(vue.createElementVNode("input", {
                password: !$data.passwordVisible,
                style: { "margin-left": "7%" },
                placeholder: "请输入您的密码",
                "onUpdate:modelValue": _cache[1] || (_cache[1] = ($event) => $data.user.password = $event)
              }, null, 8, ["password"]), [
                [vue.vModelText, $data.user.password]
              ]),
              vue.createElementVNode("view", { style: { "flex-grow": "1", "display": "flex", "justify-content": "flex-end" } }, [
                vue.createElementVNode("image", {
                  style: { "height": "18px", "width": "18px", "right": "20%" },
                  src: $data.passwordVisible ? "../../static/image/symple/pin-visible.png" : "../../static/image/symple/pin-invisible.png",
                  mode: "aspectFit",
                  onClick: _cache[2] || (_cache[2] = (...args) => $options.togglePasswordVisibility && $options.togglePasswordVisibility(...args))
                }, null, 8, ["src"])
              ])
            ])
          ]),
          vue.createElementVNode("view", { class: "phone-num" }, [
            vue.createElementVNode("view", { style: { "margin-top": "15px", "font-size": "20px", "font-weight": "600" } }, " 验证码 "),
            vue.createElementVNode("view", { class: "uni-input3" }, [
              vue.withDirectives(vue.createElementVNode(
                "input",
                {
                  type: "tel",
                  style: { "margin-left": "7%" },
                  placeholder: "请输入您的手机号",
                  "onUpdate:modelValue": _cache[3] || (_cache[3] = ($event) => $data.user.phonenum = $event)
                },
                null,
                512
                /* NEED_PATCH */
              ), [
                [vue.vModelText, $data.user.phonenum]
              ]),
              vue.createElementVNode("view", { class: "get-verification-code" }, [
                vue.createElementVNode("button", {
                  class: vue.normalizeClass(["get-verification-code-button", { "button-disabled": $data.sendcode.isButtonDisabled }]),
                  onClick: _cache[4] || (_cache[4] = (...args) => $options.getVercode && $options.getVercode(...args)),
                  disabled: $data.sendcode.isButtonDisabled
                }, vue.toDisplayString($data.sendcode.countdown ? `${$data.sendcode.countdown}` : "获取验证码"), 11, ["disabled"])
              ])
            ])
          ]),
          vue.createElementVNode("view", { class: "verification-ensure" }, [
            vue.createElementVNode("view", { class: "uni-input4" }, [
              vue.withDirectives(vue.createElementVNode(
                "input",
                {
                  style: { "margin-left": "7%" },
                  placeholder: "请输入验证码",
                  "onUpdate:modelValue": _cache[5] || (_cache[5] = ($event) => $data.user.vercode = $event)
                },
                null,
                512
                /* NEED_PATCH */
              ), [
                [vue.vModelText, $data.user.vercode]
              ])
            ])
          ])
        ]),
        vue.createElementVNode("view", { class: "button-section" }, [
          vue.createElementVNode("view", { class: "sign-up" }, [
            vue.createElementVNode("button", {
              class: "bt-sign-up",
              onClick: _cache[6] || (_cache[6] = (...args) => $options.registOnSubmit && $options.registOnSubmit(...args))
            }, "注册")
          ])
        ]),
        vue.createCommentVNode(" 下面两块颠倒了 "),
        vue.createElementVNode("view", { class: "otherway-sign-up" }, [
          vue.createElementVNode("view", { class: "other-way" }, [
            vue.createElementVNode("view", { class: "other-way-img" }, [
              vue.createElementVNode("image", {
                style: { "height": "25px", "width": "25px" },
                src: "/static/image/logo/wx-logo-raw.png",
                mode: "aspectFit"
              })
            ]),
            vue.createElementVNode("view", { class: "other-way-img" }, [
              vue.createElementVNode("image", {
                style: { "height": "24px", "width": "24px" },
                src: "/static/image/logo/qq-logo-raw.png",
                mode: "aspectFit"
              })
            ]),
            vue.createElementVNode("view", { class: "other-way-img" }, [
              vue.createElementVNode("image", {
                style: { "height": "22px", "width": "22px", "margin-top": "-5px" },
                src: "/static/image/logo/apple-logo-raw.png",
                mode: "aspectFit"
              })
            ])
          ]),
          vue.createElementVNode("view", { class: "split-line" }, " — 其他注册方式 — ")
        ])
      ])
    ]);
  }
  const PagesRegisterRegister = /* @__PURE__ */ _export_sfc(_sfc_main$a, [["render", _sfc_render$9], ["__file", "E:/HBuilderX/Program_files/knowledge-uniapp/src/pages/register/register.vue"]]);
  const fontData = [
    {
      "font_class": "arrow-down",
      "unicode": ""
    },
    {
      "font_class": "arrow-left",
      "unicode": ""
    },
    {
      "font_class": "arrow-right",
      "unicode": ""
    },
    {
      "font_class": "arrow-up",
      "unicode": ""
    },
    {
      "font_class": "auth",
      "unicode": ""
    },
    {
      "font_class": "auth-filled",
      "unicode": ""
    },
    {
      "font_class": "back",
      "unicode": ""
    },
    {
      "font_class": "bars",
      "unicode": ""
    },
    {
      "font_class": "calendar",
      "unicode": ""
    },
    {
      "font_class": "calendar-filled",
      "unicode": ""
    },
    {
      "font_class": "camera",
      "unicode": ""
    },
    {
      "font_class": "camera-filled",
      "unicode": ""
    },
    {
      "font_class": "cart",
      "unicode": ""
    },
    {
      "font_class": "cart-filled",
      "unicode": ""
    },
    {
      "font_class": "chat",
      "unicode": ""
    },
    {
      "font_class": "chat-filled",
      "unicode": ""
    },
    {
      "font_class": "chatboxes",
      "unicode": ""
    },
    {
      "font_class": "chatboxes-filled",
      "unicode": ""
    },
    {
      "font_class": "chatbubble",
      "unicode": ""
    },
    {
      "font_class": "chatbubble-filled",
      "unicode": ""
    },
    {
      "font_class": "checkbox",
      "unicode": ""
    },
    {
      "font_class": "checkbox-filled",
      "unicode": ""
    },
    {
      "font_class": "checkmarkempty",
      "unicode": ""
    },
    {
      "font_class": "circle",
      "unicode": ""
    },
    {
      "font_class": "circle-filled",
      "unicode": ""
    },
    {
      "font_class": "clear",
      "unicode": ""
    },
    {
      "font_class": "close",
      "unicode": ""
    },
    {
      "font_class": "closeempty",
      "unicode": ""
    },
    {
      "font_class": "cloud-download",
      "unicode": ""
    },
    {
      "font_class": "cloud-download-filled",
      "unicode": ""
    },
    {
      "font_class": "cloud-upload",
      "unicode": ""
    },
    {
      "font_class": "cloud-upload-filled",
      "unicode": ""
    },
    {
      "font_class": "color",
      "unicode": ""
    },
    {
      "font_class": "color-filled",
      "unicode": ""
    },
    {
      "font_class": "compose",
      "unicode": ""
    },
    {
      "font_class": "contact",
      "unicode": ""
    },
    {
      "font_class": "contact-filled",
      "unicode": ""
    },
    {
      "font_class": "down",
      "unicode": ""
    },
    {
      "font_class": "bottom",
      "unicode": ""
    },
    {
      "font_class": "download",
      "unicode": ""
    },
    {
      "font_class": "download-filled",
      "unicode": ""
    },
    {
      "font_class": "email",
      "unicode": ""
    },
    {
      "font_class": "email-filled",
      "unicode": ""
    },
    {
      "font_class": "eye",
      "unicode": ""
    },
    {
      "font_class": "eye-filled",
      "unicode": ""
    },
    {
      "font_class": "eye-slash",
      "unicode": ""
    },
    {
      "font_class": "eye-slash-filled",
      "unicode": ""
    },
    {
      "font_class": "fire",
      "unicode": ""
    },
    {
      "font_class": "fire-filled",
      "unicode": ""
    },
    {
      "font_class": "flag",
      "unicode": ""
    },
    {
      "font_class": "flag-filled",
      "unicode": ""
    },
    {
      "font_class": "folder-add",
      "unicode": ""
    },
    {
      "font_class": "folder-add-filled",
      "unicode": ""
    },
    {
      "font_class": "font",
      "unicode": ""
    },
    {
      "font_class": "forward",
      "unicode": ""
    },
    {
      "font_class": "gear",
      "unicode": ""
    },
    {
      "font_class": "gear-filled",
      "unicode": ""
    },
    {
      "font_class": "gift",
      "unicode": ""
    },
    {
      "font_class": "gift-filled",
      "unicode": ""
    },
    {
      "font_class": "hand-down",
      "unicode": ""
    },
    {
      "font_class": "hand-down-filled",
      "unicode": ""
    },
    {
      "font_class": "hand-up",
      "unicode": ""
    },
    {
      "font_class": "hand-up-filled",
      "unicode": ""
    },
    {
      "font_class": "headphones",
      "unicode": ""
    },
    {
      "font_class": "heart",
      "unicode": ""
    },
    {
      "font_class": "heart-filled",
      "unicode": ""
    },
    {
      "font_class": "help",
      "unicode": ""
    },
    {
      "font_class": "help-filled",
      "unicode": ""
    },
    {
      "font_class": "home",
      "unicode": ""
    },
    {
      "font_class": "home-filled",
      "unicode": ""
    },
    {
      "font_class": "image",
      "unicode": ""
    },
    {
      "font_class": "image-filled",
      "unicode": ""
    },
    {
      "font_class": "images",
      "unicode": ""
    },
    {
      "font_class": "images-filled",
      "unicode": ""
    },
    {
      "font_class": "info",
      "unicode": ""
    },
    {
      "font_class": "info-filled",
      "unicode": ""
    },
    {
      "font_class": "left",
      "unicode": ""
    },
    {
      "font_class": "link",
      "unicode": ""
    },
    {
      "font_class": "list",
      "unicode": ""
    },
    {
      "font_class": "location",
      "unicode": ""
    },
    {
      "font_class": "location-filled",
      "unicode": ""
    },
    {
      "font_class": "locked",
      "unicode": ""
    },
    {
      "font_class": "locked-filled",
      "unicode": ""
    },
    {
      "font_class": "loop",
      "unicode": ""
    },
    {
      "font_class": "mail-open",
      "unicode": ""
    },
    {
      "font_class": "mail-open-filled",
      "unicode": ""
    },
    {
      "font_class": "map",
      "unicode": ""
    },
    {
      "font_class": "map-filled",
      "unicode": ""
    },
    {
      "font_class": "map-pin",
      "unicode": ""
    },
    {
      "font_class": "map-pin-ellipse",
      "unicode": ""
    },
    {
      "font_class": "medal",
      "unicode": ""
    },
    {
      "font_class": "medal-filled",
      "unicode": ""
    },
    {
      "font_class": "mic",
      "unicode": ""
    },
    {
      "font_class": "mic-filled",
      "unicode": ""
    },
    {
      "font_class": "micoff",
      "unicode": ""
    },
    {
      "font_class": "micoff-filled",
      "unicode": ""
    },
    {
      "font_class": "minus",
      "unicode": ""
    },
    {
      "font_class": "minus-filled",
      "unicode": ""
    },
    {
      "font_class": "more",
      "unicode": ""
    },
    {
      "font_class": "more-filled",
      "unicode": ""
    },
    {
      "font_class": "navigate",
      "unicode": ""
    },
    {
      "font_class": "navigate-filled",
      "unicode": ""
    },
    {
      "font_class": "notification",
      "unicode": ""
    },
    {
      "font_class": "notification-filled",
      "unicode": ""
    },
    {
      "font_class": "paperclip",
      "unicode": ""
    },
    {
      "font_class": "paperplane",
      "unicode": ""
    },
    {
      "font_class": "paperplane-filled",
      "unicode": ""
    },
    {
      "font_class": "person",
      "unicode": ""
    },
    {
      "font_class": "person-filled",
      "unicode": ""
    },
    {
      "font_class": "personadd",
      "unicode": ""
    },
    {
      "font_class": "personadd-filled",
      "unicode": ""
    },
    {
      "font_class": "personadd-filled-copy",
      "unicode": ""
    },
    {
      "font_class": "phone",
      "unicode": ""
    },
    {
      "font_class": "phone-filled",
      "unicode": ""
    },
    {
      "font_class": "plus",
      "unicode": ""
    },
    {
      "font_class": "plus-filled",
      "unicode": ""
    },
    {
      "font_class": "plusempty",
      "unicode": ""
    },
    {
      "font_class": "pulldown",
      "unicode": ""
    },
    {
      "font_class": "pyq",
      "unicode": ""
    },
    {
      "font_class": "qq",
      "unicode": ""
    },
    {
      "font_class": "redo",
      "unicode": ""
    },
    {
      "font_class": "redo-filled",
      "unicode": ""
    },
    {
      "font_class": "refresh",
      "unicode": ""
    },
    {
      "font_class": "refresh-filled",
      "unicode": ""
    },
    {
      "font_class": "refreshempty",
      "unicode": ""
    },
    {
      "font_class": "reload",
      "unicode": ""
    },
    {
      "font_class": "right",
      "unicode": ""
    },
    {
      "font_class": "scan",
      "unicode": ""
    },
    {
      "font_class": "search",
      "unicode": ""
    },
    {
      "font_class": "settings",
      "unicode": ""
    },
    {
      "font_class": "settings-filled",
      "unicode": ""
    },
    {
      "font_class": "shop",
      "unicode": ""
    },
    {
      "font_class": "shop-filled",
      "unicode": ""
    },
    {
      "font_class": "smallcircle",
      "unicode": ""
    },
    {
      "font_class": "smallcircle-filled",
      "unicode": ""
    },
    {
      "font_class": "sound",
      "unicode": ""
    },
    {
      "font_class": "sound-filled",
      "unicode": ""
    },
    {
      "font_class": "spinner-cycle",
      "unicode": ""
    },
    {
      "font_class": "staff",
      "unicode": ""
    },
    {
      "font_class": "staff-filled",
      "unicode": ""
    },
    {
      "font_class": "star",
      "unicode": ""
    },
    {
      "font_class": "star-filled",
      "unicode": ""
    },
    {
      "font_class": "starhalf",
      "unicode": ""
    },
    {
      "font_class": "trash",
      "unicode": ""
    },
    {
      "font_class": "trash-filled",
      "unicode": ""
    },
    {
      "font_class": "tune",
      "unicode": ""
    },
    {
      "font_class": "tune-filled",
      "unicode": ""
    },
    {
      "font_class": "undo",
      "unicode": ""
    },
    {
      "font_class": "undo-filled",
      "unicode": ""
    },
    {
      "font_class": "up",
      "unicode": ""
    },
    {
      "font_class": "top",
      "unicode": ""
    },
    {
      "font_class": "upload",
      "unicode": ""
    },
    {
      "font_class": "upload-filled",
      "unicode": ""
    },
    {
      "font_class": "videocam",
      "unicode": ""
    },
    {
      "font_class": "videocam-filled",
      "unicode": ""
    },
    {
      "font_class": "vip",
      "unicode": ""
    },
    {
      "font_class": "vip-filled",
      "unicode": ""
    },
    {
      "font_class": "wallet",
      "unicode": ""
    },
    {
      "font_class": "wallet-filled",
      "unicode": ""
    },
    {
      "font_class": "weibo",
      "unicode": ""
    },
    {
      "font_class": "weixin",
      "unicode": ""
    }
  ];
  const getVal = (val) => {
    const reg = /^[0-9]*$/g;
    return typeof val === "number" || reg.test(val) ? val + "px" : val;
  };
  const _sfc_main$9 = {
    name: "UniIcons",
    emits: ["click"],
    props: {
      type: {
        type: String,
        default: ""
      },
      color: {
        type: String,
        default: "#333333"
      },
      size: {
        type: [Number, String],
        default: 16
      },
      customPrefix: {
        type: String,
        default: ""
      },
      fontFamily: {
        type: String,
        default: ""
      }
    },
    data() {
      return {
        icons: fontData
      };
    },
    computed: {
      unicode() {
        let code2 = this.icons.find((v) => v.font_class === this.type);
        if (code2) {
          return code2.unicode;
        }
        return "";
      },
      iconSize() {
        return getVal(this.size);
      },
      styleObj() {
        if (this.fontFamily !== "") {
          return `color: ${this.color}; font-size: ${this.iconSize}; font-family: ${this.fontFamily};`;
        }
        return `color: ${this.color}; font-size: ${this.iconSize};`;
      }
    },
    methods: {
      _onClick() {
        this.$emit("click");
      }
    }
  };
  function _sfc_render$8(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock(
      "text",
      {
        style: vue.normalizeStyle($options.styleObj),
        class: vue.normalizeClass(["uni-icons", ["uniui-" + $props.type, $props.customPrefix, $props.customPrefix ? $props.type : ""]]),
        onClick: _cache[0] || (_cache[0] = (...args) => $options._onClick && $options._onClick(...args))
      },
      [
        vue.renderSlot(_ctx.$slots, "default", {}, void 0, true)
      ],
      6
      /* CLASS, STYLE */
    );
  }
  const __easycom_0$2 = /* @__PURE__ */ _export_sfc(_sfc_main$9, [["render", _sfc_render$8], ["__scopeId", "data-v-b40d096c"], ["__file", "E:/HBuilderX/Program_files/knowledge-uniapp/src/uni_modules/uni-icons/components/uni-icons/uni-icons.vue"]]);
  const _sfc_main$8 = {
    name: "uniCombox",
    emits: ["input", "update:modelValue"],
    props: {
      border: {
        type: Boolean,
        default: true
      },
      label: {
        type: String,
        default: ""
      },
      labelWidth: {
        type: String,
        default: "auto"
      },
      placeholder: {
        type: String,
        default: ""
      },
      candidates: {
        type: Array,
        default() {
          return [];
        }
      },
      emptyTips: {
        type: String,
        default: "无匹配项"
      },
      modelValue: {
        type: [String, Number],
        default: ""
      }
    },
    data() {
      return {
        showSelector: false,
        inputVal: ""
      };
    },
    computed: {
      labelStyle() {
        if (this.labelWidth === "auto") {
          return "";
        }
        return `width: ${this.labelWidth}`;
      },
      filterCandidates() {
        return this.candidates.filter((item) => {
          return item.toString().indexOf(this.inputVal) > -1;
        });
      },
      filterCandidatesLength() {
        return this.filterCandidates.length;
      }
    },
    watch: {
      modelValue: {
        handler(newVal) {
          this.inputVal = newVal;
        },
        immediate: true
      }
    },
    methods: {
      toggleSelector() {
        this.showSelector = !this.showSelector;
      },
      onFocus() {
        this.showSelector = true;
      },
      onBlur() {
        setTimeout(() => {
          this.showSelector = false;
        }, 153);
      },
      //去除em标签
      removeEmTagsFromString(str) {
        return str.replace(/<\/?em>/g, "");
      },
      onSelectorClick(index2) {
        this.inputVal = this.removeEmTagsFromString(this.filterCandidates[index2]);
        this.showSelector = false;
        this.$emit("input", this.inputVal);
        this.$emit("update:modelValue", this.inputVal);
      },
      onInput() {
        setTimeout(() => {
          this.$emit("input", this.inputVal);
          this.$emit("update:modelValue", this.inputVal);
        });
      }
    }
  };
  function _sfc_render$7(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_uni_icons = resolveEasycom(vue.resolveDynamicComponent("uni-icons"), __easycom_0$2);
    return vue.openBlock(), vue.createElementBlock(
      "view",
      {
        class: vue.normalizeClass(["uni-combox", $props.border ? "" : "uni-combox__no-border"])
      },
      [
        $props.label ? (vue.openBlock(), vue.createElementBlock(
          "view",
          {
            key: 0,
            class: "uni-combox__label",
            style: vue.normalizeStyle($options.labelStyle)
          },
          [
            vue.createElementVNode(
              "text",
              null,
              vue.toDisplayString($props.label),
              1
              /* TEXT */
            )
          ],
          4
          /* STYLE */
        )) : vue.createCommentVNode("v-if", true),
        vue.createElementVNode("view", { class: "uni-combox__input-box" }, [
          vue.withDirectives(vue.createElementVNode("input", {
            class: "uni-combox__input",
            type: "text",
            placeholder: $props.placeholder,
            "placeholder-class": "uni-combox__input-plac",
            "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => $data.inputVal = $event),
            onInput: _cache[1] || (_cache[1] = (...args) => $options.onInput && $options.onInput(...args)),
            onFocus: _cache[2] || (_cache[2] = (...args) => $options.onFocus && $options.onFocus(...args)),
            onBlur: _cache[3] || (_cache[3] = (...args) => $options.onBlur && $options.onBlur(...args))
          }, null, 40, ["placeholder"]), [
            [vue.vModelText, $data.inputVal]
          ]),
          vue.createVNode(_component_uni_icons, {
            type: $data.showSelector ? "top" : "bottom",
            size: "14",
            color: "#999",
            onClick: $options.toggleSelector
          }, null, 8, ["type", "onClick"])
        ]),
        $data.showSelector ? (vue.openBlock(), vue.createElementBlock("view", {
          key: 1,
          class: "uni-combox__selector"
        }, [
          vue.createElementVNode("view", { class: "uni-popper__arrow" }),
          vue.createElementVNode("scroll-view", {
            "scroll-y": "true",
            class: "uni-combox__selector-scroll"
          }, [
            $options.filterCandidatesLength === 0 ? (vue.openBlock(), vue.createElementBlock("view", {
              key: 0,
              class: "uni-combox__selector-empty"
            }, [
              vue.createElementVNode(
                "text",
                null,
                vue.toDisplayString($props.emptyTips),
                1
                /* TEXT */
              )
            ])) : vue.createCommentVNode("v-if", true),
            (vue.openBlock(true), vue.createElementBlock(
              vue.Fragment,
              null,
              vue.renderList($options.filterCandidates, (item, index2) => {
                return vue.openBlock(), vue.createElementBlock("view", {
                  class: "uni-combox__selector-item",
                  key: index2,
                  onClick: ($event) => $options.onSelectorClick(index2)
                }, [
                  vue.createElementVNode("rich-text", { nodes: item }, null, 8, ["nodes"])
                ], 8, ["onClick"]);
              }),
              128
              /* KEYED_FRAGMENT */
            ))
          ])
        ])) : vue.createCommentVNode("v-if", true)
      ],
      2
      /* CLASS */
    );
  }
  const __easycom_0$1 = /* @__PURE__ */ _export_sfc(_sfc_main$8, [["render", _sfc_render$7], ["__scopeId", "data-v-8144c466"], ["__file", "E:/HBuilderX/Program_files/knowledge-uniapp/src/uni_modules/uni-combox/components/uni-combox/uni-combox.vue"]]);
  const mpMixin = {};
  function email(value) {
    return /^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/.test(value);
  }
  function mobile(value) {
    return /^1([3589]\d|4[5-9]|6[1-2,4-7]|7[0-8])\d{8}$/.test(value);
  }
  function url(value) {
    return /^((https|http|ftp|rtsp|mms):\/\/)(([0-9a-zA-Z_!~*'().&=+$%-]+: )?[0-9a-zA-Z_!~*'().&=+$%-]+@)?(([0-9]{1,3}.){3}[0-9]{1,3}|([0-9a-zA-Z_!~*'()-]+.)*([0-9a-zA-Z][0-9a-zA-Z-]{0,61})?[0-9a-zA-Z].[a-zA-Z]{2,6})(:[0-9]{1,4})?((\/?)|(\/[0-9a-zA-Z_!~*'().;?:@&=+$,%#-]+)+\/?)$/.test(value);
  }
  function date(value) {
    if (!value)
      return false;
    if (number(value))
      value = +value;
    return !/Invalid|NaN/.test(new Date(value).toString());
  }
  function dateISO(value) {
    return /^\d{4}[\/\-](0?[1-9]|1[012])[\/\-](0?[1-9]|[12][0-9]|3[01])$/.test(value);
  }
  function number(value) {
    return /^[\+-]?(\d+\.?\d*|\.\d+|\d\.\d+e\+\d+)$/.test(value);
  }
  function string(value) {
    return typeof value === "string";
  }
  function digits(value) {
    return /^\d+$/.test(value);
  }
  function idCard(value) {
    return /^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}([0-9]|X)$/.test(
      value
    );
  }
  function carNo(value) {
    const xreg = /^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]{1}[A-Z]{1}(([0-9]{5}[DF]$)|([DF][A-HJ-NP-Z0-9][0-9]{4}$))/;
    const creg = /^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]{1}[A-Z]{1}[A-HJ-NP-Z0-9]{4}[A-HJ-NP-Z0-9挂学警港澳]{1}$/;
    if (value.length === 7) {
      return creg.test(value);
    }
    if (value.length === 8) {
      return xreg.test(value);
    }
    return false;
  }
  function amount(value) {
    return /^[1-9]\d*(,\d{3})*(\.\d{1,2})?$|^0\.\d{1,2}$/.test(value);
  }
  function chinese(value) {
    const reg = /^[\u4e00-\u9fa5]+$/gi;
    return reg.test(value);
  }
  function letter(value) {
    return /^[a-zA-Z]*$/.test(value);
  }
  function enOrNum(value) {
    const reg = /^[0-9a-zA-Z]*$/g;
    return reg.test(value);
  }
  function contains(value, param) {
    return value.indexOf(param) >= 0;
  }
  function range$1(value, param) {
    return value >= param[0] && value <= param[1];
  }
  function rangeLength(value, param) {
    return value.length >= param[0] && value.length <= param[1];
  }
  function landline(value) {
    const reg = /^\d{3,4}-\d{7,8}(-\d{3,4})?$/;
    return reg.test(value);
  }
  function empty(value) {
    switch (typeof value) {
      case "undefined":
        return true;
      case "string":
        if (value.replace(/(^[ \t\n\r]*)|([ \t\n\r]*$)/g, "").length == 0)
          return true;
        break;
      case "boolean":
        if (!value)
          return true;
        break;
      case "number":
        if (value === 0 || isNaN(value))
          return true;
        break;
      case "object":
        if (value === null || value.length === 0)
          return true;
        for (const i in value) {
          return false;
        }
        return true;
    }
    return false;
  }
  function jsonString(value) {
    if (typeof value === "string") {
      try {
        const obj = JSON.parse(value);
        if (typeof obj === "object" && obj) {
          return true;
        }
        return false;
      } catch (e) {
        return false;
      }
    }
    return false;
  }
  function array(value) {
    if (typeof Array.isArray === "function") {
      return Array.isArray(value);
    }
    return Object.prototype.toString.call(value) === "[object Array]";
  }
  function object(value) {
    return Object.prototype.toString.call(value) === "[object Object]";
  }
  function code(value, len = 6) {
    return new RegExp(`^\\d{${len}}$`).test(value);
  }
  function func(value) {
    return typeof value === "function";
  }
  function promise(value) {
    return object(value) && func(value.then) && func(value.catch);
  }
  function image(value) {
    const newValue = value.split("?")[0];
    const IMAGE_REGEXP = /\.(jpeg|jpg|gif|png|svg|webp|jfif|bmp|dpg)/i;
    return IMAGE_REGEXP.test(newValue);
  }
  function video(value) {
    const VIDEO_REGEXP = /\.(mp4|mpg|mpeg|dat|asf|avi|rm|rmvb|mov|wmv|flv|mkv|m3u8)/i;
    return VIDEO_REGEXP.test(value);
  }
  function regExp(o) {
    return o && Object.prototype.toString.call(o) === "[object RegExp]";
  }
  const test = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
    __proto__: null,
    amount,
    array,
    carNo,
    chinese,
    code,
    contains,
    date,
    dateISO,
    digits,
    email,
    empty,
    enOrNum,
    func,
    idCard,
    image,
    jsonString,
    landline,
    letter,
    mobile,
    number,
    object,
    promise,
    range: range$1,
    rangeLength,
    regExp,
    string,
    url,
    video
  }, Symbol.toStringTag, { value: "Module" }));
  function strip(num, precision = 15) {
    return +parseFloat(Number(num).toPrecision(precision));
  }
  function digitLength(num) {
    const eSplit = num.toString().split(/[eE]/);
    const len = (eSplit[0].split(".")[1] || "").length - +(eSplit[1] || 0);
    return len > 0 ? len : 0;
  }
  function float2Fixed(num) {
    if (num.toString().indexOf("e") === -1) {
      return Number(num.toString().replace(".", ""));
    }
    const dLen = digitLength(num);
    return dLen > 0 ? strip(Number(num) * Math.pow(10, dLen)) : Number(num);
  }
  function checkBoundary(num) {
    {
      if (num > Number.MAX_SAFE_INTEGER || num < Number.MIN_SAFE_INTEGER) {
        formatAppLog("warn", "at uni_modules/uv-ui-tools/libs/function/digit.js:45", `${num} 超出了精度限制，结果可能不正确`);
      }
    }
  }
  function iteratorOperation(arr, operation) {
    const [num1, num2, ...others] = arr;
    let res = operation(num1, num2);
    others.forEach((num) => {
      res = operation(res, num);
    });
    return res;
  }
  function times(...nums) {
    if (nums.length > 2) {
      return iteratorOperation(nums, times);
    }
    const [num1, num2] = nums;
    const num1Changed = float2Fixed(num1);
    const num2Changed = float2Fixed(num2);
    const baseNum = digitLength(num1) + digitLength(num2);
    const leftValue = num1Changed * num2Changed;
    checkBoundary(leftValue);
    return leftValue / Math.pow(10, baseNum);
  }
  function divide(...nums) {
    if (nums.length > 2) {
      return iteratorOperation(nums, divide);
    }
    const [num1, num2] = nums;
    const num1Changed = float2Fixed(num1);
    const num2Changed = float2Fixed(num2);
    checkBoundary(num1Changed);
    checkBoundary(num2Changed);
    return times(num1Changed / num2Changed, strip(Math.pow(10, digitLength(num2) - digitLength(num1))));
  }
  function round(num, ratio) {
    const base = Math.pow(10, ratio);
    let result = divide(Math.round(Math.abs(times(num, base))), base);
    if (num < 0 && result !== 0) {
      result = times(result, -1);
    }
    return result;
  }
  function range(min = 0, max = 0, value = 0) {
    return Math.max(min, Math.min(max, Number(value)));
  }
  function getPx(value, unit = false) {
    if (number(value)) {
      return unit ? `${value}px` : Number(value);
    }
    if (/(rpx|upx)$/.test(value)) {
      return unit ? `${uni.upx2px(parseInt(value))}px` : Number(uni.upx2px(parseInt(value)));
    }
    return unit ? `${parseInt(value)}px` : parseInt(value);
  }
  function sleep(value = 30) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve();
      }, value);
    });
  }
  function os() {
    return uni.getSystemInfoSync().platform.toLowerCase();
  }
  function sys() {
    return uni.getSystemInfoSync();
  }
  function random(min, max) {
    if (min >= 0 && max > 0 && max >= min) {
      const gab = max - min + 1;
      return Math.floor(Math.random() * gab + min);
    }
    return 0;
  }
  function guid(len = 32, firstU = true, radix = null) {
    const chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz".split("");
    const uuid = [];
    radix = radix || chars.length;
    if (len) {
      for (let i = 0; i < len; i++)
        uuid[i] = chars[0 | Math.random() * radix];
    } else {
      let r;
      uuid[8] = uuid[13] = uuid[18] = uuid[23] = "-";
      uuid[14] = "4";
      for (let i = 0; i < 36; i++) {
        if (!uuid[i]) {
          r = 0 | Math.random() * 16;
          uuid[i] = chars[i == 19 ? r & 3 | 8 : r];
        }
      }
    }
    if (firstU) {
      uuid.shift();
      return `u${uuid.join("")}`;
    }
    return uuid.join("");
  }
  function $parent(name = void 0) {
    let parent = this.$parent;
    while (parent) {
      if (parent.$options && parent.$options.name !== name) {
        parent = parent.$parent;
      } else {
        return parent;
      }
    }
    return false;
  }
  function addStyle(customStyle, target = "object") {
    if (empty(customStyle) || typeof customStyle === "object" && target === "object" || target === "string" && typeof customStyle === "string") {
      return customStyle;
    }
    if (target === "object") {
      customStyle = trim$1(customStyle);
      const styleArray = customStyle.split(";");
      const style = {};
      for (let i = 0; i < styleArray.length; i++) {
        if (styleArray[i]) {
          const item = styleArray[i].split(":");
          style[trim$1(item[0])] = trim$1(item[1]);
        }
      }
      return style;
    }
    let string2 = "";
    for (const i in customStyle) {
      const key = i.replace(/([A-Z])/g, "-$1").toLowerCase();
      string2 += `${key}:${customStyle[i]};`;
    }
    return trim$1(string2);
  }
  function addUnit(value = "auto", unit = ((_b) => (_b = ((_a) => (_a = uni == null ? void 0 : uni.$uv) == null ? void 0 : _a.config)()) == null ? void 0 : _b.unit)() ? ((_d) => (_d = ((_c) => (_c = uni == null ? void 0 : uni.$uv) == null ? void 0 : _c.config)()) == null ? void 0 : _d.unit)() : "px") {
    value = String(value);
    return number(value) ? `${value}${unit}` : value;
  }
  function deepClone(obj, cache = /* @__PURE__ */ new WeakMap()) {
    if (obj === null || typeof obj !== "object")
      return obj;
    if (cache.has(obj))
      return cache.get(obj);
    let clone;
    if (obj instanceof Date) {
      clone = new Date(obj.getTime());
    } else if (obj instanceof RegExp) {
      clone = new RegExp(obj);
    } else if (obj instanceof Map) {
      clone = new Map(Array.from(obj, ([key, value]) => [key, deepClone(value, cache)]));
    } else if (obj instanceof Set) {
      clone = new Set(Array.from(obj, (value) => deepClone(value, cache)));
    } else if (Array.isArray(obj)) {
      clone = obj.map((value) => deepClone(value, cache));
    } else if (Object.prototype.toString.call(obj) === "[object Object]") {
      clone = Object.create(Object.getPrototypeOf(obj));
      cache.set(obj, clone);
      for (const [key, value] of Object.entries(obj)) {
        clone[key] = deepClone(value, cache);
      }
    } else {
      clone = Object.assign({}, obj);
    }
    cache.set(obj, clone);
    return clone;
  }
  function deepMerge(target = {}, source = {}) {
    target = deepClone(target);
    if (typeof target !== "object" || target === null || typeof source !== "object" || source === null)
      return target;
    const merged = Array.isArray(target) ? target.slice() : Object.assign({}, target);
    for (const prop in source) {
      if (!source.hasOwnProperty(prop))
        continue;
      const sourceValue = source[prop];
      const targetValue = merged[prop];
      if (sourceValue instanceof Date) {
        merged[prop] = new Date(sourceValue);
      } else if (sourceValue instanceof RegExp) {
        merged[prop] = new RegExp(sourceValue);
      } else if (sourceValue instanceof Map) {
        merged[prop] = new Map(sourceValue);
      } else if (sourceValue instanceof Set) {
        merged[prop] = new Set(sourceValue);
      } else if (typeof sourceValue === "object" && sourceValue !== null) {
        merged[prop] = deepMerge(targetValue, sourceValue);
      } else {
        merged[prop] = sourceValue;
      }
    }
    return merged;
  }
  function error(err) {
    {
      formatAppLog("error", "at uni_modules/uv-ui-tools/libs/function/index.js:250", `uvui提示：${err}`);
    }
  }
  function randomArray(array2 = []) {
    return array2.sort(() => Math.random() - 0.5);
  }
  if (!String.prototype.padStart) {
    String.prototype.padStart = function(maxLength, fillString = " ") {
      if (Object.prototype.toString.call(fillString) !== "[object String]") {
        throw new TypeError(
          "fillString must be String"
        );
      }
      const str = this;
      if (str.length >= maxLength)
        return String(str);
      const fillLength = maxLength - str.length;
      let times2 = Math.ceil(fillLength / fillString.length);
      while (times2 >>= 1) {
        fillString += fillString;
        if (times2 === 1) {
          fillString += fillString;
        }
      }
      return fillString.slice(0, fillLength) + str;
    };
  }
  function timeFormat(dateTime = null, formatStr = "yyyy-mm-dd") {
    let date2;
    if (!dateTime) {
      date2 = new Date();
    } else if (/^\d{10}$/.test(dateTime == null ? void 0 : dateTime.toString().trim())) {
      date2 = new Date(dateTime * 1e3);
    } else if (typeof dateTime === "string" && /^\d+$/.test(dateTime.trim())) {
      date2 = new Date(Number(dateTime));
    } else if (typeof dateTime === "string" && dateTime.includes("-") && !dateTime.includes("T")) {
      date2 = new Date(dateTime.replace(/-/g, "/"));
    } else {
      date2 = new Date(dateTime);
    }
    const timeSource = {
      "y": date2.getFullYear().toString(),
      // 年
      "m": (date2.getMonth() + 1).toString().padStart(2, "0"),
      // 月
      "d": date2.getDate().toString().padStart(2, "0"),
      // 日
      "h": date2.getHours().toString().padStart(2, "0"),
      // 时
      "M": date2.getMinutes().toString().padStart(2, "0"),
      // 分
      "s": date2.getSeconds().toString().padStart(2, "0")
      // 秒
      // 有其他格式化字符需求可以继续添加，必须转化成字符串
    };
    for (const key in timeSource) {
      const [ret] = new RegExp(`${key}+`).exec(formatStr) || [];
      if (ret) {
        const beginIndex = key === "y" && ret.length === 2 ? 2 : 0;
        formatStr = formatStr.replace(ret, timeSource[key].slice(beginIndex));
      }
    }
    return formatStr;
  }
  function timeFrom(timestamp = null, format = "yyyy-mm-dd") {
    if (timestamp == null)
      timestamp = Number(new Date());
    timestamp = parseInt(timestamp);
    if (timestamp.toString().length == 10)
      timestamp *= 1e3;
    let timer = new Date().getTime() - timestamp;
    timer = parseInt(timer / 1e3);
    let tips = "";
    switch (true) {
      case timer < 300:
        tips = "刚刚";
        break;
      case (timer >= 300 && timer < 3600):
        tips = `${parseInt(timer / 60)}分钟前`;
        break;
      case (timer >= 3600 && timer < 86400):
        tips = `${parseInt(timer / 3600)}小时前`;
        break;
      case (timer >= 86400 && timer < 2592e3):
        tips = `${parseInt(timer / 86400)}天前`;
        break;
      default:
        if (format === false) {
          if (timer >= 2592e3 && timer < 365 * 86400) {
            tips = `${parseInt(timer / (86400 * 30))}个月前`;
          } else {
            tips = `${parseInt(timer / (86400 * 365))}年前`;
          }
        } else {
          tips = timeFormat(timestamp, format);
        }
    }
    return tips;
  }
  function trim$1(str, pos = "both") {
    str = String(str);
    if (pos == "both") {
      return str.replace(/^\s+|\s+$/g, "");
    }
    if (pos == "left") {
      return str.replace(/^\s*/, "");
    }
    if (pos == "right") {
      return str.replace(/(\s*$)/g, "");
    }
    if (pos == "all") {
      return str.replace(/\s+/g, "");
    }
    return str;
  }
  function queryParams(data = {}, isPrefix = true, arrayFormat = "brackets") {
    const prefix = isPrefix ? "?" : "";
    const _result = [];
    if (["indices", "brackets", "repeat", "comma"].indexOf(arrayFormat) == -1)
      arrayFormat = "brackets";
    for (const key in data) {
      const value = data[key];
      if (["", void 0, null].indexOf(value) >= 0) {
        continue;
      }
      if (value.constructor === Array) {
        switch (arrayFormat) {
          case "indices":
            for (let i = 0; i < value.length; i++) {
              _result.push(`${key}[${i}]=${value[i]}`);
            }
            break;
          case "brackets":
            value.forEach((_value) => {
              _result.push(`${key}[]=${_value}`);
            });
            break;
          case "repeat":
            value.forEach((_value) => {
              _result.push(`${key}=${_value}`);
            });
            break;
          case "comma":
            let commaStr = "";
            value.forEach((_value) => {
              commaStr += (commaStr ? "," : "") + _value;
            });
            _result.push(`${key}=${commaStr}`);
            break;
          default:
            value.forEach((_value) => {
              _result.push(`${key}[]=${_value}`);
            });
        }
      } else {
        _result.push(`${key}=${value}`);
      }
    }
    return _result.length ? prefix + _result.join("&") : "";
  }
  function toast(title, duration = 2e3) {
    uni.showToast({
      title: String(title),
      icon: "none",
      duration
    });
  }
  function type2icon(type = "success", fill = false) {
    if (["primary", "info", "error", "warning", "success"].indexOf(type) == -1)
      type = "success";
    let iconName = "";
    switch (type) {
      case "primary":
        iconName = "info-circle";
        break;
      case "info":
        iconName = "info-circle";
        break;
      case "error":
        iconName = "close-circle";
        break;
      case "warning":
        iconName = "error-circle";
        break;
      case "success":
        iconName = "checkmark-circle";
        break;
      default:
        iconName = "checkmark-circle";
    }
    if (fill)
      iconName += "-fill";
    return iconName;
  }
  function priceFormat(number2, decimals = 0, decimalPoint = ".", thousandsSeparator = ",") {
    number2 = `${number2}`.replace(/[^0-9+-Ee.]/g, "");
    const n = !isFinite(+number2) ? 0 : +number2;
    const prec = !isFinite(+decimals) ? 0 : Math.abs(decimals);
    const sep = typeof thousandsSeparator === "undefined" ? "," : thousandsSeparator;
    const dec = typeof decimalPoint === "undefined" ? "." : decimalPoint;
    let s = "";
    s = (prec ? round(n, prec) + "" : `${Math.round(n)}`).split(".");
    const re = /(-?\d+)(\d{3})/;
    while (re.test(s[0])) {
      s[0] = s[0].replace(re, `$1${sep}$2`);
    }
    if ((s[1] || "").length < prec) {
      s[1] = s[1] || "";
      s[1] += new Array(prec - s[1].length + 1).join("0");
    }
    return s.join(dec);
  }
  function getDuration(value, unit = true) {
    const valueNum = parseInt(value);
    if (unit) {
      if (/s$/.test(value))
        return value;
      return value > 30 ? `${value}ms` : `${value}s`;
    }
    if (/ms$/.test(value))
      return valueNum;
    if (/s$/.test(value))
      return valueNum > 30 ? valueNum : valueNum * 1e3;
    return valueNum;
  }
  function padZero(value) {
    return `00${value}`.slice(-2);
  }
  function formValidate(instance, event) {
    const formItem = $parent.call(instance, "uv-form-item");
    const form = $parent.call(instance, "uv-form");
    if (formItem && form) {
      form.validateField(formItem.prop, () => {
      }, event);
    }
  }
  function getProperty(obj, key) {
    if (!obj) {
      return;
    }
    if (typeof key !== "string" || key === "") {
      return "";
    }
    if (key.indexOf(".") !== -1) {
      const keys = key.split(".");
      let firstObj = obj[keys[0]] || {};
      for (let i = 1; i < keys.length; i++) {
        if (firstObj) {
          firstObj = firstObj[keys[i]];
        }
      }
      return firstObj;
    }
    return obj[key];
  }
  function setProperty(obj, key, value) {
    if (!obj) {
      return;
    }
    const inFn = function(_obj, keys, v) {
      if (keys.length === 1) {
        _obj[keys[0]] = v;
        return;
      }
      while (keys.length > 1) {
        const k = keys[0];
        if (!_obj[k] || typeof _obj[k] !== "object") {
          _obj[k] = {};
        }
        keys.shift();
        inFn(_obj[k], keys, v);
      }
    };
    if (typeof key !== "string" || key === "")
      ;
    else if (key.indexOf(".") !== -1) {
      const keys = key.split(".");
      inFn(obj, keys, value);
    } else {
      obj[key] = value;
    }
  }
  function page() {
    var _a;
    const pages2 = getCurrentPages();
    const route2 = (_a = pages2[pages2.length - 1]) == null ? void 0 : _a.route;
    return `/${route2 ? route2 : ""}`;
  }
  function pages() {
    const pages2 = getCurrentPages();
    return pages2;
  }
  function getHistoryPage(back = 0) {
    const pages2 = getCurrentPages();
    const len = pages2.length;
    return pages2[len - 1 + back];
  }
  function setConfig({
    props: props2 = {},
    config = {},
    color = {},
    zIndex = {}
  }) {
    const {
      deepMerge: deepMerge2
    } = uni.$uv;
    uni.$uv.config = deepMerge2(uni.$uv.config, config);
    uni.$uv.props = deepMerge2(uni.$uv.props, props2);
    uni.$uv.color = deepMerge2(uni.$uv.color, color);
    uni.$uv.zIndex = deepMerge2(uni.$uv.zIndex, zIndex);
  }
  const index = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
    __proto__: null,
    $parent,
    addStyle,
    addUnit,
    deepClone,
    deepMerge,
    error,
    formValidate,
    getDuration,
    getHistoryPage,
    getProperty,
    getPx,
    guid,
    os,
    padZero,
    page,
    pages,
    priceFormat,
    queryParams,
    random,
    randomArray,
    range,
    setConfig,
    setProperty,
    sleep,
    sys,
    timeFormat,
    timeFrom,
    toast,
    trim: trim$1,
    type2icon
  }, Symbol.toStringTag, { value: "Module" }));
  class Router {
    constructor() {
      this.config = {
        type: "navigateTo",
        url: "",
        delta: 1,
        // navigateBack页面后退时,回退的层数
        params: {},
        // 传递的参数
        animationType: "pop-in",
        // 窗口动画,只在APP有效
        animationDuration: 300,
        // 窗口动画持续时间,单位毫秒,只在APP有效
        intercept: false,
        // 是否需要拦截
        events: {}
        // 页面间通信接口，用于监听被打开页面发送到当前页面的数据。hbuilderx 2.8.9+ 开始支持。
      };
      this.route = this.route.bind(this);
    }
    // 判断url前面是否有"/"，如果没有则加上，否则无法跳转
    addRootPath(url2) {
      return url2[0] === "/" ? url2 : `/${url2}`;
    }
    // 整合路由参数
    mixinParam(url2, params) {
      url2 = url2 && this.addRootPath(url2);
      let query = "";
      if (/.*\/.*\?.*=.*/.test(url2)) {
        query = queryParams(params, false);
        return url2 += `&${query}`;
      }
      query = queryParams(params);
      return url2 += query;
    }
    // 对外的方法名称
    async route(options = {}, params = {}) {
      let mergeConfig2 = {};
      if (typeof options === "string") {
        mergeConfig2.url = this.mixinParam(options, params);
        mergeConfig2.type = "navigateTo";
      } else {
        mergeConfig2 = deepMerge(this.config, options);
        mergeConfig2.url = this.mixinParam(options.url, options.params);
      }
      if (mergeConfig2.url === page())
        return;
      if (params.intercept) {
        mergeConfig2.intercept = params.intercept;
      }
      mergeConfig2.params = params;
      mergeConfig2 = deepMerge(this.config, mergeConfig2);
      if (typeof mergeConfig2.intercept === "function") {
        const isNext = await new Promise((resolve, reject) => {
          mergeConfig2.intercept(mergeConfig2, resolve);
        });
        isNext && this.openPage(mergeConfig2);
      } else {
        this.openPage(mergeConfig2);
      }
    }
    // 执行路由跳转
    openPage(config) {
      const {
        url: url2,
        type,
        delta,
        animationType,
        animationDuration,
        events
      } = config;
      if (config.type == "navigateTo" || config.type == "to") {
        uni.navigateTo({
          url: url2,
          animationType,
          animationDuration,
          events
        });
      }
      if (config.type == "redirectTo" || config.type == "redirect") {
        uni.redirectTo({
          url: url2
        });
      }
      if (config.type == "switchTab" || config.type == "tab") {
        uni.switchTab({
          url: url2
        });
      }
      if (config.type == "reLaunch" || config.type == "launch") {
        uni.reLaunch({
          url: url2
        });
      }
      if (config.type == "navigateBack" || config.type == "back") {
        uni.navigateBack({
          delta
        });
      }
    }
  }
  const route = new Router().route;
  let timeout = null;
  function debounce(func2, wait = 500, immediate = false) {
    if (timeout !== null)
      clearTimeout(timeout);
    if (immediate) {
      const callNow = !timeout;
      timeout = setTimeout(() => {
        timeout = null;
      }, wait);
      if (callNow)
        typeof func2 === "function" && func2();
    } else {
      timeout = setTimeout(() => {
        typeof func2 === "function" && func2();
      }, wait);
    }
  }
  let flag;
  function throttle(func2, wait = 500, immediate = true) {
    if (immediate) {
      if (!flag) {
        flag = true;
        typeof func2 === "function" && func2();
        setTimeout(() => {
          flag = false;
        }, wait);
      }
    } else if (!flag) {
      flag = true;
      setTimeout(() => {
        flag = false;
        typeof func2 === "function" && func2();
      }, wait);
    }
  }
  const mixin = {
    // 定义每个组件都可能需要用到的外部样式以及类名
    props: {
      // 每个组件都有的父组件传递的样式，可以为字符串或者对象形式
      customStyle: {
        type: [Object, String],
        default: () => ({})
      },
      customClass: {
        type: String,
        default: ""
      },
      // 跳转的页面路径
      url: {
        type: String,
        default: ""
      },
      // 页面跳转的类型
      linkType: {
        type: String,
        default: "navigateTo"
      }
    },
    data() {
      return {};
    },
    onLoad() {
      this.$uv.getRect = this.$uvGetRect;
    },
    created() {
      this.$uv.getRect = this.$uvGetRect;
    },
    computed: {
      $uv() {
        var _a, _b;
        return {
          ...index,
          test,
          route,
          debounce,
          throttle,
          unit: (_b = (_a = uni == null ? void 0 : uni.$uv) == null ? void 0 : _a.config) == null ? void 0 : _b.unit
        };
      },
      /**
       * 生成bem规则类名
       * 由于微信小程序，H5，nvue之间绑定class的差异，无法通过:class="[bem()]"的形式进行同用
       * 故采用如下折中做法，最后返回的是数组（一般平台）或字符串（支付宝和字节跳动平台），类似['a', 'b', 'c']或'a b c'的形式
       * @param {String} name 组件名称
       * @param {Array} fixed 一直会存在的类名
       * @param {Array} change 会根据变量值为true或者false而出现或者隐藏的类名
       * @returns {Array|string}
       */
      bem() {
        return function(name, fixed, change) {
          const prefix = `uv-${name}--`;
          const classes = {};
          if (fixed) {
            fixed.map((item) => {
              classes[prefix + this[item]] = true;
            });
          }
          if (change) {
            change.map((item) => {
              this[item] ? classes[prefix + item] = this[item] : delete classes[prefix + item];
            });
          }
          return Object.keys(classes);
        };
      }
    },
    methods: {
      // 跳转某一个页面
      openPage(urlKey = "url") {
        const url2 = this[urlKey];
        if (url2) {
          uni[this.linkType]({
            url: url2
          });
        }
      },
      // 查询节点信息
      // 目前此方法在支付宝小程序中无法获取组件跟接点的尺寸，为支付宝的bug(2020-07-21)
      // 解决办法为在组件根部再套一个没有任何作用的view元素
      $uvGetRect(selector, all) {
        return new Promise((resolve) => {
          uni.createSelectorQuery().in(this)[all ? "selectAll" : "select"](selector).boundingClientRect((rect) => {
            if (all && Array.isArray(rect) && rect.length) {
              resolve(rect);
            }
            if (!all && rect) {
              resolve(rect);
            }
          }).exec();
        });
      },
      getParentData(parentName = "") {
        if (!this.parent)
          this.parent = {};
        this.parent = this.$uv.$parent.call(this, parentName);
        if (this.parent.children) {
          this.parent.children.indexOf(this) === -1 && this.parent.children.push(this);
        }
        if (this.parent && this.parentData) {
          Object.keys(this.parentData).map((key) => {
            this.parentData[key] = this.parent[key];
          });
        }
      },
      // 阻止事件冒泡
      preventEvent(e) {
        e && typeof e.stopPropagation === "function" && e.stopPropagation();
      },
      // 空操作
      noop(e) {
        this.preventEvent(e);
      }
    },
    onReachBottom() {
      uni.$emit("uvOnReachBottom");
    },
    beforeDestroy() {
      if (this.parent && array(this.parent.children)) {
        const childrenList = this.parent.children;
        childrenList.map((child, index2) => {
          if (child === this) {
            childrenList.splice(index2, 1);
          }
        });
      }
    },
    // 兼容vue3
    unmounted() {
      if (this.parent && array(this.parent.children)) {
        const childrenList = this.parent.children;
        childrenList.map((child, index2) => {
          if (child === this) {
            childrenList.splice(index2, 1);
          }
        });
      }
    }
  };
  class MPAnimation {
    constructor(options, _this) {
      this.options = options;
      this.animation = uni.createAnimation({
        ...options
      });
      this.currentStepAnimates = {};
      this.next = 0;
      this.$ = _this;
    }
    _nvuePushAnimates(type, args) {
      let aniObj = this.currentStepAnimates[this.next];
      let styles = {};
      if (!aniObj) {
        styles = {
          styles: {},
          config: {}
        };
      } else {
        styles = aniObj;
      }
      if (animateTypes1.includes(type)) {
        if (!styles.styles.transform) {
          styles.styles.transform = "";
        }
        let unit = "";
        if (type === "rotate") {
          unit = "deg";
        }
        styles.styles.transform += `${type}(${args + unit}) `;
      } else {
        styles.styles[type] = `${args}`;
      }
      this.currentStepAnimates[this.next] = styles;
    }
    _animateRun(styles = {}, config = {}) {
      let ref = this.$.$refs["ani"].ref;
      if (!ref)
        return;
      return new Promise((resolve, reject) => {
        nvueAnimation.transition(ref, {
          styles,
          ...config
        }, (res) => {
          resolve();
        });
      });
    }
    _nvueNextAnimate(animates, step = 0, fn) {
      let obj = animates[step];
      if (obj) {
        let {
          styles,
          config
        } = obj;
        this._animateRun(styles, config).then(() => {
          step += 1;
          this._nvueNextAnimate(animates, step, fn);
        });
      } else {
        this.currentStepAnimates = {};
        typeof fn === "function" && fn();
        this.isEnd = true;
      }
    }
    step(config = {}) {
      this.animation.step(config);
      return this;
    }
    run(fn) {
      this.$.animationData = this.animation.export();
      this.$.timer = setTimeout(() => {
        typeof fn === "function" && fn();
      }, this.$.durationTime);
    }
  }
  const animateTypes1 = [
    "matrix",
    "matrix3d",
    "rotate",
    "rotate3d",
    "rotateX",
    "rotateY",
    "rotateZ",
    "scale",
    "scale3d",
    "scaleX",
    "scaleY",
    "scaleZ",
    "skew",
    "skewX",
    "skewY",
    "translate",
    "translate3d",
    "translateX",
    "translateY",
    "translateZ"
  ];
  const animateTypes2 = ["opacity", "backgroundColor"];
  const animateTypes3 = ["width", "height", "left", "right", "top", "bottom"];
  animateTypes1.concat(animateTypes2, animateTypes3).forEach((type) => {
    MPAnimation.prototype[type] = function(...args) {
      this.animation[type](...args);
      return this;
    };
  });
  function createAnimation(option, _this) {
    if (!_this)
      return;
    clearTimeout(_this.timer);
    return new MPAnimation(option, _this);
  }
  const _sfc_main$7 = {
    name: "uv-transition",
    mixins: [mpMixin, mixin],
    emits: ["click", "change"],
    props: {
      // 是否展示组件
      show: {
        type: Boolean,
        default: false
      },
      // 使用的动画模式
      mode: {
        type: [Array, String, null],
        default() {
          return "fade";
        }
      },
      // 动画的执行时间，单位ms
      duration: {
        type: [String, Number],
        default: 300
      },
      // 使用的动画过渡函数
      timingFunction: {
        type: String,
        default: "ease-out"
      },
      customClass: {
        type: String,
        default: ""
      },
      // nvue模式下 是否直接显示，在uv-list等cell下面使用就需要设置
      cellChild: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        isShow: false,
        transform: "",
        opacity: 1,
        animationData: {},
        durationTime: 300,
        config: {}
      };
    },
    watch: {
      show: {
        handler(newVal) {
          if (newVal) {
            this.open();
          } else {
            if (this.isShow) {
              this.close();
            }
          }
        },
        immediate: true
      }
    },
    computed: {
      // 初始化动画条件
      transformStyles() {
        const style = {
          transform: this.transform,
          opacity: this.opacity,
          ...this.$uv.addStyle(this.customStyle),
          "transition-duration": `${this.duration / 1e3}s`
        };
        return this.$uv.addStyle(style, "string");
      }
    },
    created() {
      this.config = {
        duration: this.duration,
        timingFunction: this.timingFunction,
        transformOrigin: "50% 50%",
        delay: 0
      };
      this.durationTime = this.duration;
    },
    methods: {
      /**
       *  ref 触发 初始化动画
       */
      init(obj = {}) {
        if (obj.duration) {
          this.durationTime = obj.duration;
        }
        this.animation = createAnimation(Object.assign(this.config, obj), this);
      },
      /**
       * 点击组件触发回调
       */
      onClick() {
        this.$emit("click", {
          detail: this.isShow
        });
      },
      /**
       * ref 触发 动画分组
       * @param {Object} obj
       */
      step(obj, config = {}) {
        if (!this.animation)
          return;
        for (let i in obj) {
          try {
            if (typeof obj[i] === "object") {
              this.animation[i](...obj[i]);
            } else {
              this.animation[i](obj[i]);
            }
          } catch (e) {
            formatAppLog("error", "at uni_modules/uv-transition/components/uv-transition/uv-transition.vue:166", `方法 ${i} 不存在`);
          }
        }
        this.animation.step(config);
        return this;
      },
      /**
       *  ref 触发 执行动画
       */
      run(fn) {
        if (!this.animation)
          return;
        this.animation.run(fn);
      },
      // 开始过度动画
      open() {
        clearTimeout(this.timer);
        this.transform = "";
        this.isShow = true;
        let { opacity, transform } = this.styleInit(false);
        if (typeof opacity !== "undefined") {
          this.opacity = opacity;
        }
        this.transform = transform;
        this.$nextTick(() => {
          this.timer = setTimeout(() => {
            this.animation = createAnimation(this.config, this);
            this.tranfromInit(false).step();
            this.animation.run();
            this.$emit("change", {
              detail: this.isShow
            });
          }, 20);
        });
      },
      // 关闭过渡动画
      close(type) {
        if (!this.animation)
          return;
        this.tranfromInit(true).step().run(() => {
          this.isShow = false;
          this.animationData = null;
          this.animation = null;
          let { opacity, transform } = this.styleInit(false);
          this.opacity = opacity || 1;
          this.transform = transform;
          this.$emit("change", {
            detail: this.isShow
          });
        });
      },
      // 处理动画开始前的默认样式
      styleInit(type) {
        let styles = {
          transform: ""
        };
        let buildStyle = (type2, mode) => {
          if (mode === "fade") {
            styles.opacity = this.animationType(type2)[mode];
          } else {
            styles.transform += this.animationType(type2)[mode] + " ";
          }
        };
        if (typeof this.mode === "string") {
          buildStyle(type, this.mode);
        } else {
          this.mode.forEach((mode) => {
            buildStyle(type, mode);
          });
        }
        return styles;
      },
      // 处理内置组合动画
      tranfromInit(type) {
        let buildTranfrom = (type2, mode) => {
          let aniNum = null;
          if (mode === "fade") {
            aniNum = type2 ? 0 : 1;
          } else {
            aniNum = type2 ? "-100%" : "0";
            if (mode === "zoom-in") {
              aniNum = type2 ? 0.8 : 1;
            }
            if (mode === "zoom-out") {
              aniNum = type2 ? 1.2 : 1;
            }
            if (mode === "slide-right") {
              aniNum = type2 ? "100%" : "0";
            }
            if (mode === "slide-bottom") {
              aniNum = type2 ? "100%" : "0";
            }
          }
          this.animation[this.animationMode()[mode]](aniNum);
        };
        if (typeof this.mode === "string") {
          buildTranfrom(type, this.mode);
        } else {
          this.mode.forEach((mode) => {
            buildTranfrom(type, mode);
          });
        }
        return this.animation;
      },
      animationType(type) {
        return {
          fade: type ? 1 : 0,
          "slide-top": `translateY(${type ? "0" : "-100%"})`,
          "slide-right": `translateX(${type ? "0" : "100%"})`,
          "slide-bottom": `translateY(${type ? "0" : "100%"})`,
          "slide-left": `translateX(${type ? "0" : "-100%"})`,
          "zoom-in": `scaleX(${type ? 1 : 0.8}) scaleY(${type ? 1 : 0.8})`,
          "zoom-out": `scaleX(${type ? 1 : 1.2}) scaleY(${type ? 1 : 1.2})`
        };
      },
      // 内置动画类型与实际动画对应字典
      animationMode() {
        return {
          fade: "opacity",
          "slide-top": "translateY",
          "slide-right": "translateX",
          "slide-bottom": "translateY",
          "slide-left": "translateX",
          "zoom-in": "scale",
          "zoom-out": "scale"
        };
      },
      // 驼峰转中横线
      toLine(name) {
        return name.replace(/([A-Z])/g, "-$1").toLowerCase();
      }
    }
  };
  function _sfc_render$6(_ctx, _cache, $props, $setup, $data, $options) {
    return $data.isShow ? (vue.openBlock(), vue.createElementBlock("view", {
      key: 0,
      ref: "ani",
      animation: $data.animationData,
      class: vue.normalizeClass($props.customClass),
      style: vue.normalizeStyle($options.transformStyles),
      onClick: _cache[0] || (_cache[0] = (...args) => $options.onClick && $options.onClick(...args))
    }, [
      vue.renderSlot(_ctx.$slots, "default")
    ], 14, ["animation"])) : vue.createCommentVNode("v-if", true);
  }
  const __easycom_0 = /* @__PURE__ */ _export_sfc(_sfc_main$7, [["render", _sfc_render$6], ["__file", "E:/HBuilderX/Program_files/knowledge-uniapp/src/uni_modules/uv-transition/components/uv-transition/uv-transition.vue"]]);
  const props = {
    props: {
      // 是否显示遮罩
      show: {
        type: Boolean,
        default: false
      },
      // 层级z-index
      zIndex: {
        type: [String, Number],
        default: 10070
      },
      // 遮罩的过渡时间，单位为ms
      duration: {
        type: [String, Number],
        default: 300
      },
      // 不透明度值，当做rgba的第四个参数
      opacity: {
        type: [String, Number],
        default: 0.5
      },
      ...(_f = (_e = uni.$uv) == null ? void 0 : _e.props) == null ? void 0 : _f.overlay
    }
  };
  const _sfc_main$6 = {
    name: "uv-overlay",
    emits: ["click"],
    mixins: [mpMixin, mixin, props],
    watch: {
      show(newVal) {
      }
    },
    computed: {
      overlayStyle() {
        const style = {
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: this.zIndex,
          bottom: 0,
          "background-color": `rgba(0, 0, 0, ${this.opacity})`
        };
        return this.$uv.deepMerge(style, this.$uv.addStyle(this.customStyle));
      }
    },
    methods: {
      clickHandler() {
        this.$emit("click");
      },
      clear() {
      }
    }
  };
  function _sfc_render$5(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_uv_transition = resolveEasycom(vue.resolveDynamicComponent("uv-transition"), __easycom_0);
    return vue.openBlock(), vue.createBlock(_component_uv_transition, {
      show: _ctx.show,
      mode: "fade",
      "custom-class": "uv-overlay",
      duration: _ctx.duration,
      "custom-style": $options.overlayStyle,
      onClick: $options.clickHandler,
      onTouchmove: vue.withModifiers($options.clear, ["stop", "prevent"])
    }, {
      default: vue.withCtx(() => [
        vue.renderSlot(_ctx.$slots, "default", {}, void 0, true)
      ]),
      _: 3
      /* FORWARDED */
    }, 8, ["show", "duration", "custom-style", "onClick", "onTouchmove"]);
  }
  const __easycom_1 = /* @__PURE__ */ _export_sfc(_sfc_main$6, [["render", _sfc_render$5], ["__scopeId", "data-v-471c50bd"], ["__file", "E:/HBuilderX/Program_files/knowledge-uniapp/src/uni_modules/uv-overlay/components/uv-overlay/uv-overlay.vue"]]);
  const _sfc_main$5 = {
    data() {
      return {
        show: false,
        state: 0,
        //弹窗进行阶段
        isAnimating: false,
        // 控制动画的播放
        highlightedIndex: null,
        // 用来跟踪当前高亮的按钮索引
        buttons: [
          {
            label: "我是初中生"
          },
          {
            label: "我是高中生"
          },
          {
            label: "我是本科生"
          },
          {
            label: "我是研究生"
          }
        ],
        classNumber: "",
        //学号
        currentclasses: [],
        //目前待选年级
        classesCandidates: [
          ["初一", "初二", "初三"],
          ["高一", "高二", "高三"],
          ["大一", "大二", "大三", "大四"],
          ["研一", "研二", "研三"]
        ],
        classes: "",
        //年级
        name: "",
        originalschoolCandidates: [
          {
            id: 2,
            name: "清华大学"
          },
          {
            id: 3,
            name: "北京大学"
          },
          {
            id: 119,
            name: "中国人民大学"
          },
          {
            id: 319,
            name: "北京交通大学"
          },
          {
            id: 340,
            name: "北京工业大学"
          },
          {
            id: 352,
            name: "北京服装学院"
          },
          {
            id: 374,
            name: "北京航空航天大学"
          },
          {
            id: 356,
            name: "北京理工大学"
          },
          {
            id: 363,
            name: "北京科技大学"
          },
          {
            id: 386,
            name: "北方工业大学"
          },
          {
            id: 330,
            name: "北京化工大学"
          },
          {
            id: 323,
            name: "北京体育大学"
          },
          {
            id: 334,
            name: "北京印刷学院"
          },
          {
            id: 381,
            name: "北京邮电大学"
          }
        ],
        schoolCandidates: [],
        // 学校对象数组
        selectedSchoolName: "",
        // 临时存储选中的学校名称
        schoolId: "",
        // 存储选中的学校ID
        studentCardImageSrc: "",
        //学生证照片本地存储路径
        debounceTimer: null,
        // 用于存储防抖定时器
        isSubmitting: false
        //是否处于提交中
      };
    },
    mounted() {
      this.schoolCandidates = this.originalschoolCandidates;
    },
    watch: {
      // 监听schoolName的变化
      selectedSchoolName(newVal, oldVal) {
        if (newVal == null || newVal.length == 0) {
          this.schoolCandidates = this.originalschoolCandidates;
          this.schoolId = null;
          formatAppLog("log", "at pages/schoolcicle/verification.vue:310", "关键字长度为0");
          return;
        }
        if (newVal !== oldVal) {
          this.fetchSchoolDetailsDebounced(newVal);
        }
      }
    },
    methods: {
      resetProperties() {
        this.state = 0;
        this.isAnimating = false;
        this.highlightedIndex = null;
        this.selectedSchoolName = "";
        this.studentCardImageSrc = "";
        this.name = "";
        this.schoolId = null;
        this.classes = "";
        this.classNumber = "";
        this.show = true;
      },
      //选择身份时点击
      handleButtonClick(index2) {
        if (this.isAnimating) {
          return;
        }
        if (this.highlightedIndex === index2) {
          formatAppLog("log", "at pages/schoolcicle/verification.vue:340", "确认: ", this.buttons[index2].label);
          this.performAction(index2);
        } else {
          this.highlightedIndex = index2;
          formatAppLog("log", "at pages/schoolcicle/verification.vue:345", "当前选中：", this.buttons[index2].label);
        }
      },
      //选择身份时确认
      performAction(index2) {
        formatAppLog("log", "at pages/schoolcicle/verification.vue:350", "执行操作，身份索引: ", index2);
        this.currentclasses = this.classesCandidates[index2];
        this.isAnimating = true;
        setTimeout(() => {
          this.state = 1;
          this.isAnimating = false;
          formatAppLog("log", "at pages/schoolcicle/verification.vue:359", this.schoolCandidates);
        }, 2e3);
      },
      //防抖请求学校信息
      fetchSchoolDetailsDebounced(newVal) {
        clearTimeout(this.debounceTimer);
        this.debounceTimer = setTimeout(() => {
          this.fetchSchoolDetails(newVal);
        }, 400);
      },
      fetchSchoolDetails(newVal) {
        if (this.selectedSchoolName.trim().length === 0 || this.selectedSchoolName == null) {
          return;
        }
        if (/^[a-zA-Z\s]*$/.test(this.selectedSchoolName.trim()))
          return;
        this.$service.post("/search-service/api/school", {
          "q": newVal,
          "current": 1,
          "size": 25
        }).then((response2) => {
          formatAppLog("log", "at pages/schoolcicle/verification.vue:389", "请求学校响应信息：", response2);
          if (response2.data.isSuccess == 1) {
            this.schoolCandidates = response2.data.data.data.map(
              (school) => ({
                name: school.name,
                id: school.id
              })
            );
            formatAppLog("log", "at pages/schoolcicle/verification.vue:398", "待选学校：", this.schoolCandidates);
            const schoolCandidatesAfterProcess = this.schoolCandidates.map((school) => {
              return {
                ...school,
                name: school.name.replace(/<em>/g, "").replace(/<\/em>/g, "")
              };
            });
            const selectedSchool = schoolCandidatesAfterProcess.find(
              (school) => school.name === newVal
            );
            if (selectedSchool) {
              this.schoolId = selectedSchool.id;
              this.schoolCandidates = [selectedSchool];
            } else {
              this.schoolId = null;
            }
            formatAppLog("log", "at pages/schoolcicle/verification.vue:416", "当前学校id：", this.schoolId);
          } else {
            formatAppLog(
              "error",
              "at pages/schoolcicle/verification.vue:419",
              "获取学校信息失败:",
              response2.data.message
            );
          }
        }).catch((error2) => {
          formatAppLog("error", "at pages/schoolcicle/verification.vue:427", "请求出错", error2);
          uni.showToast({
            title: "获取学校信息失败",
            icon: "none",
            position: "top",
            duration: 2e3
          });
        });
      },
      //上一页
      back() {
        if (this.isAnimating) {
          return;
        }
        if (this.state == 2) {
          this.classes = "";
        }
        if (this.state == 3) {
          if (this.isSubmitting == true) {
            return;
          }
        }
        this.state = this.state - 1;
      },
      //下一页
      next() {
        if (this.isAnimating) {
          return;
        }
        if (this.state === 1 && this.schoolId == null) {
          uni.showToast({
            title: "请填写学校信息",
            icon: "none",
            duration: 2e3
          });
          return;
        }
        if (this.state === 2 && this.classes === "") {
          uni.showToast({
            title: "请填写年级信息",
            icon: "none",
            duration: 2e3
          });
          return;
        }
        this.isAnimating = true;
        setTimeout(() => {
          this.state = this.state + 1;
          this.isAnimating = false;
        }, 2e3);
      },
      //结束填写
      quit() {
        setTimeout(() => {
          this.show = false;
        }, 800);
      },
      //关闭弹窗
      noTitlemodalTap: function(e) {
        uni.showModal({
          content: "确认关闭吗？这会丢失当前的填写信息",
          confirmText: "确定",
          cancelText: "取消",
          success: (res) => {
            if (res.confirm) {
              formatAppLog("log", "at pages/schoolcicle/verification.vue:495", "用户点击确定");
              this.show = false;
              formatAppLog("log", "at pages/schoolcicle/verification.vue:497", "this.show:", this.show);
            } else if (res.cancel) {
              formatAppLog("log", "at pages/schoolcicle/verification.vue:499", "用户点击取消");
            }
          }
        });
      },
      //上传照片
      uploadPhoto() {
        uni.showActionSheet({
          itemList: ["从相册选择", "拍照"],
          success: (res) => {
            formatAppLog("log", "at pages/schoolcicle/verification.vue:509", "选择了第" + (res.tapIndex + 1) + "个选项");
            if (res.tapIndex == 0) {
              uni.chooseImage({
                count: 1,
                //上传图片的数量，默认是9
                sizeType: ["original", "compressed"],
                //可以指定是原图还是压缩图，默认二者都有
                sourceType: ["album"],
                //从相册选择
                success: (res2) => {
                  const tempFilePaths = res2.tempFilePaths;
                  this.studentCardImageSrc = tempFilePaths[0];
                }
              });
            } else {
              uni.chooseImage({
                count: 1,
                //上传图片的数量，默认是9
                sizeType: ["original", "compressed"],
                //可以指定是原图还是压缩图，默认二者都有
                sourceType: ["camera"],
                //拍照
                success: (res2) => {
                  const tempFilePaths = res2.tempFilePaths;
                  this.studentCardImageSrc = tempFilePaths[0];
                }
              });
            }
          },
          fail: (err) => {
            formatAppLog("log", "at pages/schoolcicle/verification.vue:535", "弹窗取消");
          }
        });
      },
      //最后上传所有信息
      upload() {
        if (this.isSubmitting) {
          return;
        }
        const fieldMappings = [
          {
            key: "name",
            message: "请填写姓名"
          },
          {
            key: "classNumber",
            message: "请填写学号"
          },
          {
            key: "classes",
            message: "请选择年级"
          },
          {
            key: "schoolId",
            message: "请选择学校"
          },
          {
            key: "studentCardImageSrc",
            message: "请上传学生证或校园卡照片"
          }
        ];
        const unfilledItem = fieldMappings.find((item) => !this[item.key]);
        if (unfilledItem) {
          uni.showToast({
            title: unfilledItem.message,
            // 使用找到的未填项的提示消息
            icon: "none",
            position: "top",
            duration: 2e3
          });
          formatAppLog("log", "at pages/schoolcicle/verification.vue:580", unfilledItem.message);
          return;
        }
        this.isSubmitting = true;
        uni.showLoading({
          title: "正在上传..."
        });
        const token = uni.getStorageSync("token");
        uni.uploadFile({
          url: "http://127.0.0.1:280/user-service/api/auth/identity",
          //post请求的地址
          filePath: this.studentCardImageSrc,
          name: "image",
          header: {
            token
          },
          formData: {
            //formData是指除了图片以外，额外加的字段
            classNumber: this.classNumber,
            classes: this.classes,
            name: this.name,
            schoolId: this.schoolId
          },
          success: (uploadFileRes2) => {
            formatAppLog("log", "at pages/schoolcicle/verification.vue:606", "接口调用成功");
            let responseData;
            try {
              responseData = JSON.parse(uploadFileRes2.data);
            } catch (error2) {
              formatAppLog("error", "at pages/schoolcicle/verification.vue:612", "解析响应数据失败", error2);
              uni.showToast({
                title: "上传出错，请重试",
                icon: "none"
              });
              return;
            }
            formatAppLog("log", "at pages/schoolcicle/verification.vue:619", "响应信息：", responseData);
            uni.hideLoading();
            if (responseData.isSuccess) {
              formatAppLog("log", "at pages/schoolcicle/verification.vue:622", "认证信息上传成功！");
              uni.showToast({
                title: "上传成功！请等待审核",
                icon: "success",
                duration: 2e3
              });
              setTimeout(() => {
                this.next();
              }, 1200);
            } else {
              formatAppLog("log", "at pages/schoolcicle/verification.vue:632", "上传出错：", responseData.message);
              uni.showToast({
                title: "上传出错：" + responseData.message,
                icon: "none"
              });
            }
          },
          fail: () => {
            formatAppLog("log", "at pages/schoolcicle/verification.vue:640", "接口调用失败");
            formatAppLog("log", "at pages/schoolcicle/verification.vue:641", uploadFileRes.errMsg);
            uni.hideLoading();
            uni.showToast({
              title: "网络出错，请重试",
              icon: "error"
            });
          },
          complete: () => {
            this.isSubmitting = false;
          }
        });
      },
      //更新用户信息
      getUserInfo() {
        this.$service.get("/user-service/api/user").then((response2) => {
          formatAppLog("log", "at pages/schoolcicle/verification.vue:660", "响应信息：", response2);
          if (response2.data.isSuccess == 1) {
            const userdata = response2.data.data;
            uni.setStorageSync(
              "userdata",
              JSON.stringify(userdata)
            );
            formatAppLog("log", "at pages/schoolcicle/verification.vue:672", "用户信息", userdata);
          }
        }).catch((error2) => {
          formatAppLog("error", "at pages/schoolcicle/verification.vue:677", "请求出错", error2);
        });
      }
    }
  };
  function _sfc_render$4(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_uni_combox = resolveEasycom(vue.resolveDynamicComponent("uni-combox"), __easycom_0$1);
    const _component_uv_overlay = resolveEasycom(vue.resolveDynamicComponent("uv-overlay"), __easycom_1);
    return vue.openBlock(), vue.createBlock(_component_uv_overlay, {
      show: $data.show,
      style: { "z-index": "100" }
    }, {
      default: vue.withCtx(() => [
        vue.createElementVNode("view", { class: "warp" }, [
          vue.createCommentVNode(" 选择身份 "),
          $data.state == 0 ? (vue.openBlock(), vue.createElementBlock("view", {
            key: 0,
            class: "rect",
            onClick: _cache[1] || (_cache[1] = vue.withModifiers(() => {
            }, ["stop"]))
          }, [
            vue.createElementVNode("image", {
              onClick: _cache[0] || (_cache[0] = ($event) => $options.noTitlemodalTap()),
              class: "rect-cancel",
              src: "/static/image/symple/cancel.svg",
              mode: ""
            }),
            vue.createElementVNode("view", { class: "rect-title" }, [
              vue.createElementVNode("text", { class: "title-text" }, " 选择身份 "),
              vue.createElementVNode("image", {
                style: { "height": "25px", "width": "72%" },
                src: "/static/image/resource/split-line.png",
                mode: "aspectFit"
              })
            ]),
            vue.createElementVNode("view", { class: "choose-grade" }, [
              (vue.openBlock(true), vue.createElementBlock(
                vue.Fragment,
                null,
                vue.renderList($data.buttons, (item, index2) => {
                  return vue.openBlock(), vue.createElementBlock("button", {
                    key: index2,
                    class: vue.normalizeClass({
                      "highlight-background": $data.highlightedIndex === index2
                    }),
                    onClick: ($event) => $options.handleButtonClick(index2)
                  }, [
                    vue.createTextVNode(
                      vue.toDisplayString(item.label) + " ",
                      1
                      /* TEXT */
                    ),
                    vue.withDirectives(vue.createElementVNode(
                      "image",
                      {
                        style: { "height": "25px", "width": "25px" },
                        src: "/static/image/symple/arrow-forward.png",
                        mode: ""
                      },
                      null,
                      512
                      /* NEED_PATCH */
                    ), [
                      [vue.vShow, $data.highlightedIndex === index2]
                    ])
                  ], 10, ["onClick"]);
                }),
                128
                /* KEYED_FRAGMENT */
              ))
            ]),
            vue.createCommentVNode(" 确认动画 "),
            vue.createElementVNode("view", {
              class: "check",
              style: { "margin-top": "-5px" }
            }, [
              (vue.openBlock(), vue.createElementBlock("svg", {
                width: "40",
                height: "40"
              }, [
                vue.createElementVNode(
                  "circle",
                  {
                    class: vue.normalizeClass(["circle", { animateCircle: $data.isAnimating }]),
                    fill: "none",
                    stroke: "#32CD32",
                    "stroke-width": "3",
                    cx: "20",
                    cy: "20",
                    r: "18",
                    "stroke-linecap": "round",
                    transform: "rotate(-90,20,20)"
                  },
                  null,
                  2
                  /* CLASS */
                ),
                vue.createElementVNode(
                  "polyline",
                  {
                    class: vue.normalizeClass(["tick", { animateTick: $data.isAnimating }]),
                    fill: "none",
                    stroke: "#32CD32",
                    "stroke-width": "4",
                    points: "9,21 17,28 30,14",
                    "stroke-linecap": "round",
                    "stroke-linejoin": "round"
                  },
                  null,
                  2
                  /* CLASS */
                )
              ]))
            ])
          ])) : vue.createCommentVNode("v-if", true),
          vue.createCommentVNode(" 选择学校 "),
          $data.state == 1 ? (vue.openBlock(), vue.createElementBlock("view", {
            key: 1,
            class: "rect",
            onClick: _cache[6] || (_cache[6] = vue.withModifiers(() => {
            }, ["stop"]))
          }, [
            vue.createElementVNode("image", {
              onClick: _cache[2] || (_cache[2] = ($event) => $options.noTitlemodalTap()),
              class: "rect-cancel",
              src: "/static/image/symple/cancel.svg",
              mode: ""
            }),
            vue.createElementVNode("view", { class: "rect-title" }, [
              vue.createElementVNode("text", { class: "title-text" }, " 选择学校 "),
              vue.createElementVNode("image", {
                style: { "height": "25px", "width": "72%" },
                src: "/static/image/resource/split-line.png",
                mode: "aspectFit"
              })
            ]),
            vue.createElementVNode("view", { class: "choose-school" }, [
              vue.createElementVNode("text", { class: "choose-school-text" }, "你的学校"),
              vue.createElementVNode("view", { class: "input-section" }, [
                vue.createVNode(_component_uni_combox, {
                  class: "choose-school-input",
                  modelValue: $data.selectedSchoolName,
                  "onUpdate:modelValue": _cache[3] || (_cache[3] = ($event) => $data.selectedSchoolName = $event),
                  candidates: this.schoolCandidates.map(
                    (school) => school.name
                  ),
                  placeholder: "请选择所在学校"
                }, null, 8, ["modelValue", "candidates"])
              ])
            ]),
            vue.createCommentVNode(" 确认动画 "),
            vue.createElementVNode("view", { style: { "flex-grow": "1", "display": "flex" } }, [
              vue.createElementVNode("view", { class: "check" }, [
                (vue.openBlock(), vue.createElementBlock("svg", {
                  width: "40",
                  height: "40"
                }, [
                  vue.createElementVNode(
                    "circle",
                    {
                      class: vue.normalizeClass(["circle", { animateCircle: $data.isAnimating }]),
                      fill: "none",
                      stroke: "#32CD32",
                      "stroke-width": "3",
                      cx: "20",
                      cy: "20",
                      r: "18",
                      "stroke-linecap": "round",
                      transform: "rotate(-90,20,20)"
                    },
                    null,
                    2
                    /* CLASS */
                  ),
                  vue.createElementVNode(
                    "polyline",
                    {
                      class: vue.normalizeClass(["tick", { animateTick: $data.isAnimating }]),
                      fill: "none",
                      stroke: "#32CD32",
                      "stroke-width": "4",
                      points: "9,21 17,28 30,14",
                      "stroke-linecap": "round",
                      "stroke-linejoin": "round"
                    },
                    null,
                    2
                    /* CLASS */
                  )
                ]))
              ])
            ]),
            vue.createElementVNode("view", { class: "bottom" }, [
              vue.createElementVNode("view", {
                class: "back",
                onClick: _cache[4] || (_cache[4] = ($event) => $options.back())
              }, [
                vue.createElementVNode("image", {
                  style: { "height": "30px", "width": "30px" },
                  src: "/static/image/symple/arrow-back.png",
                  mode: ""
                }),
                vue.createElementVNode("text", null, "返回上一页")
              ]),
              vue.createElementVNode("view", {
                class: "next",
                onClick: _cache[5] || (_cache[5] = ($event) => $options.next())
              }, [
                vue.createElementVNode("text", null, "继续"),
                vue.createElementVNode("image", {
                  style: { "height": "30px", "width": "30px" },
                  src: "/static/image/symple/arrow-forward.png",
                  mode: ""
                })
              ])
            ])
          ])) : vue.createCommentVNode("v-if", true),
          vue.createCommentVNode(" 选择年级 "),
          $data.state == 2 ? (vue.openBlock(), vue.createElementBlock("view", {
            key: 2,
            class: "rect",
            onClick: _cache[11] || (_cache[11] = vue.withModifiers(() => {
            }, ["stop"]))
          }, [
            vue.createElementVNode("image", {
              onClick: _cache[7] || (_cache[7] = ($event) => $options.noTitlemodalTap()),
              class: "rect-cancel",
              src: "/static/image/symple/cancel.svg",
              mode: ""
            }),
            vue.createElementVNode("view", { class: "rect-title" }, [
              vue.createElementVNode("text", { class: "title-text" }, " 选择年级 "),
              vue.createElementVNode("image", {
                style: { "height": "25px", "width": "72%" },
                src: "/static/image/resource/split-line.png",
                mode: "aspectFit"
              })
            ]),
            vue.createElementVNode("view", { class: "choose-classes" }, [
              vue.createElementVNode("text", { class: "choose-classes-text" }, "你的年级"),
              vue.createElementVNode("view", { class: "input-section" }, [
                vue.createVNode(_component_uni_combox, {
                  class: "choose-classes-input",
                  candidates: $data.currentclasses,
                  placeholder: "请选择所在年级",
                  modelValue: $data.classes,
                  "onUpdate:modelValue": _cache[8] || (_cache[8] = ($event) => $data.classes = $event)
                }, null, 8, ["candidates", "modelValue"])
              ])
            ]),
            vue.createCommentVNode(" 确认动画 "),
            vue.createElementVNode("view", { style: { "flex-grow": "1", "display": "flex" } }, [
              vue.createElementVNode("view", { class: "check" }, [
                (vue.openBlock(), vue.createElementBlock("svg", {
                  width: "40",
                  height: "40"
                }, [
                  vue.createElementVNode(
                    "circle",
                    {
                      class: vue.normalizeClass(["circle", { animateCircle: $data.isAnimating }]),
                      fill: "none",
                      stroke: "#32CD32",
                      "stroke-width": "3",
                      cx: "20",
                      cy: "20",
                      r: "18",
                      "stroke-linecap": "round",
                      transform: "rotate(-90,20,20)"
                    },
                    null,
                    2
                    /* CLASS */
                  ),
                  vue.createElementVNode(
                    "polyline",
                    {
                      class: vue.normalizeClass(["tick", { animateTick: $data.isAnimating }]),
                      fill: "none",
                      stroke: "#32CD32",
                      "stroke-width": "4",
                      points: "9,21 17,28 30,14",
                      "stroke-linecap": "round",
                      "stroke-linejoin": "round"
                    },
                    null,
                    2
                    /* CLASS */
                  )
                ]))
              ])
            ]),
            vue.createElementVNode("view", { class: "bottom" }, [
              vue.createElementVNode("view", {
                class: "back",
                onClick: _cache[9] || (_cache[9] = ($event) => $options.back())
              }, [
                vue.createElementVNode("image", {
                  style: { "height": "30px", "width": "30px" },
                  src: "/static/image/symple/arrow-back.png",
                  mode: ""
                }),
                vue.createElementVNode("text", null, "返回上一页")
              ]),
              vue.createElementVNode("view", {
                class: "next",
                onClick: _cache[10] || (_cache[10] = ($event) => $options.next())
              }, [
                vue.createElementVNode("text", null, "继续"),
                vue.createElementVNode("image", {
                  style: { "height": "30px", "width": "30px" },
                  src: "/static/image/symple/arrow-forward.png",
                  mode: ""
                })
              ])
            ])
          ])) : vue.createCommentVNode("v-if", true),
          vue.createCommentVNode(" 填写基本信息 "),
          $data.state == 3 ? (vue.openBlock(), vue.createElementBlock("view", {
            key: 3,
            class: "rect",
            onClick: _cache[18] || (_cache[18] = vue.withModifiers(() => {
            }, ["stop"]))
          }, [
            vue.createElementVNode("image", {
              onClick: _cache[12] || (_cache[12] = ($event) => $options.noTitlemodalTap()),
              class: "rect-cancel",
              src: "/static/image/symple/cancel.svg",
              mode: ""
            }),
            vue.createElementVNode("view", { class: "rect-title" }, [
              vue.createElementVNode("text", { class: "title-text" }, " 填写基本信息 "),
              vue.createElementVNode("image", {
                style: { "height": "25px", "width": "72%" },
                src: "/static/image/resource/split-line.png",
                mode: "aspectFit"
              })
            ]),
            vue.createElementVNode("view", { class: "common-input" }, [
              vue.createElementVNode("text", { class: "common-text" }, "你的姓名"),
              vue.createElementVNode("view", { class: "input-section" }, [
                vue.withDirectives(vue.createElementVNode(
                  "input",
                  {
                    class: "input",
                    type: "text",
                    "onUpdate:modelValue": _cache[13] || (_cache[13] = ($event) => $data.name = $event)
                  },
                  null,
                  512
                  /* NEED_PATCH */
                ), [
                  [vue.vModelText, $data.name]
                ])
              ])
            ]),
            vue.createElementVNode("view", { class: "common-input" }, [
              vue.createElementVNode("text", { class: "common-text" }, "你的学号"),
              vue.createElementVNode("view", { class: "input-section" }, [
                vue.withDirectives(vue.createElementVNode(
                  "input",
                  {
                    class: "input",
                    type: "number",
                    "onUpdate:modelValue": _cache[14] || (_cache[14] = ($event) => $data.classNumber = $event)
                  },
                  null,
                  512
                  /* NEED_PATCH */
                ), [
                  [vue.vModelText, $data.classNumber]
                ])
              ])
            ]),
            vue.createElementVNode("view", { class: "common-input" }, [
              vue.createElementVNode("text", { class: "common-text" }, "上传学生证|校园卡")
            ]),
            vue.createCommentVNode(" 上传学生证 "),
            vue.createElementVNode("view", {
              class: "upload",
              onClick: _cache[15] || (_cache[15] = ($event) => $options.uploadPhoto())
            }, [
              $data.studentCardImageSrc ? (vue.openBlock(), vue.createElementBlock("image", {
                key: 0,
                src: $data.studentCardImageSrc,
                class: "uploaded-image"
              }, null, 8, ["src"])) : (vue.openBlock(), vue.createElementBlock("image", {
                key: 1,
                style: { "height": "35px", "width": "35px", "opacity": "0.4" },
                src: "/static/image/symple/upload.png"
              }))
            ]),
            vue.createCommentVNode(" 确认动画 "),
            vue.createElementVNode("view", { style: { "flex-grow": "1", "display": "flex" } }, [
              vue.createElementVNode("view", { class: "check" }, [
                (vue.openBlock(), vue.createElementBlock("svg", {
                  width: "40",
                  height: "40"
                }, [
                  vue.createElementVNode(
                    "circle",
                    {
                      class: vue.normalizeClass(["circle", { animateCircle: $data.isAnimating }]),
                      fill: "none",
                      stroke: "#32CD32",
                      "stroke-width": "3",
                      cx: "20",
                      cy: "20",
                      r: "18",
                      "stroke-linecap": "round",
                      transform: "rotate(-90,20,20)"
                    },
                    null,
                    2
                    /* CLASS */
                  ),
                  vue.createElementVNode(
                    "polyline",
                    {
                      class: vue.normalizeClass(["tick", { animateTick: $data.isAnimating }]),
                      fill: "none",
                      stroke: "#32CD32",
                      "stroke-width": "4",
                      points: "9,21 17,28 30,14",
                      "stroke-linecap": "round",
                      "stroke-linejoin": "round"
                    },
                    null,
                    2
                    /* CLASS */
                  )
                ]))
              ])
            ]),
            vue.createCommentVNode(" 底部 "),
            vue.createElementVNode("view", { class: "bottom" }, [
              vue.createElementVNode("view", {
                class: "back",
                onClick: _cache[16] || (_cache[16] = ($event) => $options.back())
              }, [
                vue.createElementVNode("image", {
                  style: { "height": "30px", "width": "30px" },
                  src: "/static/image/symple/arrow-back.png",
                  mode: ""
                }),
                vue.createElementVNode("text", null, "返回上一页")
              ]),
              vue.createElementVNode("view", {
                class: "next",
                onClick: _cache[17] || (_cache[17] = ($event) => $options.upload()),
                disabled: $data.isSubmitting
              }, [
                vue.createElementVNode("text", null, "提交"),
                vue.createElementVNode("image", {
                  style: { "height": "30px", "width": "30px" },
                  src: "/static/image/symple/done.png",
                  mode: ""
                })
              ], 8, ["disabled"])
            ])
          ])) : vue.createCommentVNode("v-if", true),
          vue.createCommentVNode(" 末尾结束页"),
          $data.state == 4 ? (vue.openBlock(), vue.createElementBlock("view", {
            key: 4,
            class: "rect",
            onClick: _cache[20] || (_cache[20] = vue.withModifiers(() => {
            }, ["stop"]))
          }, [
            vue.createElementVNode("view", { class: "rect-title" }, [
              vue.createElementVNode("text", {
                class: "title-text",
                style: { "margin-top": "18px" }
              }, " 填写完毕 "),
              vue.createElementVNode("image", {
                style: { "height": "25px", "width": "72%" },
                src: "/static/image/resource/split-line.png",
                mode: "aspectFit"
              })
            ]),
            vue.createElementVNode("view", { class: "end-page" }, [
              vue.createElementVNode("text", null, "您已完成填写，请等待审核！")
            ]),
            vue.createElementVNode("view", { style: { "flex-grow": "1", "display": "flex", "justify-content": "center", "align-items": "center" } }, [
              vue.createElementVNode("view", {
                class: "quit",
                onClick: _cache[19] || (_cache[19] = ($event) => $options.quit())
              }, [
                vue.createElementVNode("image", {
                  style: { "height": "32px", "width": "32px" },
                  src: "/static/image/symple/arrow-forward.png",
                  mode: ""
                })
              ])
            ])
          ])) : vue.createCommentVNode("v-if", true)
        ])
      ]),
      _: 1
      /* STABLE */
    }, 8, ["show"]);
  }
  const PagesSchoolcicleVerification = /* @__PURE__ */ _export_sfc(_sfc_main$5, [["render", _sfc_render$4], ["__file", "E:/HBuilderX/Program_files/knowledge-uniapp/src/pages/schoolcicle/verification.vue"]]);
  const _sfc_main$4 = {
    components: {
      verification: PagesSchoolcicleVerification
    },
    data() {
      return {};
    },
    methods: {
      //点击发布时的验证逻辑
      verification() {
        const token = this.$store.state.token;
        if (token == null || token.length == 0) {
          uni.showToast({
            title: "请先登录",
            icon: "none",
            position: "top",
            duration: 2e3
          });
          formatAppLog("log", "at pages/schoolcicle/schoolcicle.vue:30", "请先登录");
          return;
        }
        var userdataStr = uni.getStorageSync("userdata");
        if (userdataStr) {
          var userdata = JSON.parse(userdataStr);
          if (userdata.auth == "未认证") {
            uni.showModal({
              content: "发布需要认证学生信息，是否去认证？",
              confirmText: "现在去",
              cancelText: "取消",
              success: (res) => {
                if (res.confirm) {
                  formatAppLog("log", "at pages/schoolcicle/schoolcicle.vue:46", "用户点击确定");
                  this.$refs.verificationRef.resetProperties();
                } else if (res.cancel) {
                  formatAppLog("log", "at pages/schoolcicle/schoolcicle.vue:50", "用户点击取消");
                  return;
                }
              }
            });
          }
        }
      }
    }
  };
  function _sfc_render$3(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_verification = vue.resolveComponent("verification");
    return vue.openBlock(), vue.createElementBlock(
      vue.Fragment,
      null,
      [
        vue.createElementVNode("view", { class: "status_bar" }, [
          vue.createCommentVNode(" 这里是状态栏 ")
        ]),
        vue.createElementVNode("button", {
          onClick: _cache[0] || (_cache[0] = ($event) => $options.verification())
        }, "发布"),
        vue.createVNode(
          _component_verification,
          { ref: "verificationRef" },
          null,
          512
          /* NEED_PATCH */
        )
      ],
      64
      /* STABLE_FRAGMENT */
    );
  }
  const PagesSchoolcicleSchoolcicle = /* @__PURE__ */ _export_sfc(_sfc_main$4, [["render", _sfc_render$3], ["__file", "E:/HBuilderX/Program_files/knowledge-uniapp/src/pages/schoolcicle/schoolcicle.vue"]]);
  const _sfc_main$3 = {
    data() {
      return {};
    },
    methods: {}
  };
  function _sfc_render$2(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("view");
  }
  const PagesPertifunctionPertifunction = /* @__PURE__ */ _export_sfc(_sfc_main$3, [["render", _sfc_render$2], ["__file", "E:/HBuilderX/Program_files/knowledge-uniapp/src/pages/pertifunction/pertifunction.vue"]]);
  const _sfc_main$2 = {
    data() {
      return {
        papers: [
          {
            title: "2023全国乙卷数学高考真题 3题",
            imgSrc: "/static/image/resource/samplePaper.png"
          },
          {
            title: "2023全国乙卷数学高考真题 3题",
            imgSrc: "/static/image/resource/samplePaper.png"
          },
          {
            title: "2023全国乙卷数学高考真题 3题",
            imgSrc: "/static/image/resource/samplePaper.png"
          },
          {
            title: "2023全国乙卷数学高考真题 3题",
            imgSrc: "/static/image/resource/samplePaper.png"
          }
        ]
      };
    },
    methods: {}
  };
  function _sfc_render$1(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("view", { class: "page" }, [
      (vue.openBlock(true), vue.createElementBlock(
        vue.Fragment,
        null,
        vue.renderList($data.papers, (paper, index2) => {
          return vue.openBlock(), vue.createElementBlock("view", {
            class: "paper-section",
            key: index2
          }, [
            vue.createElementVNode("image", {
              class: "img",
              src: paper.imgSrc,
              mode: "widthFix"
            }, null, 8, ["src"]),
            vue.createElementVNode(
              "text",
              { class: "text" },
              vue.toDisplayString(paper.title),
              1
              /* TEXT */
            )
          ]);
        }),
        128
        /* KEYED_FRAGMENT */
      ))
    ]);
  }
  const wrongQuestions = /* @__PURE__ */ _export_sfc(_sfc_main$2, [["render", _sfc_render$1], ["__scopeId", "data-v-cc24397b"], ["__file", "E:/HBuilderX/Program_files/knowledge-uniapp/src/pages/mine/wrongQuestions.vue"]]);
  const _imports_0 = "/static/image/symple/moon.png";
  const _imports_1 = "/static/image/symple/setting.png";
  const _imports_2 = "/static/image/resource/mine-attendence.png";
  const _imports_3 = "/static/image/resource/mine-mission.png";
  const _imports_4 = "/static/image/resource/mine-create.png";
  const _sfc_main$1 = {
    components: {
      topSearchAndLogin,
      wrongQuestions
    },
    data() {
      return {
        topTitle: "我的",
        userdata: {
          avatar: "/static/image/resource/basepage-defaultAvatar.png",
          username: "用户1654351435",
          level: 1,
          location: "武汉",
          identity: "学生",
          score: 0,
          //积分
          fans: 0,
          //粉丝
          follow: 0,
          //关注
          creatity: 0,
          //创作
          friends: 0
          //好友
        },
        buttons: ["近期错题", "最近浏览", "我的收藏", "积分商城"],
        activeIndex: 0
        // 初始值为0表示第一个按钮被选中
      };
    },
    computed: mapState({
      // 从state中拿到数据 箭头函数可使代码更简练
      userAvatar: (state) => state.userdata.headImg
    }),
    methods: {
      changeColor(index2) {
        this.activeIndex = index2;
      },
      logOut() {
        store.commit("logout");
        uni.showToast({
          title: "已退出登录",
          icon: "success",
          duration: 2e3
        });
      }
    }
  };
  function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_topSearchAndLogin = vue.resolveComponent("topSearchAndLogin");
    const _component_wrongQuestions = vue.resolveComponent("wrongQuestions");
    return vue.openBlock(), vue.createElementBlock("view", null, [
      vue.createElementVNode("view", { class: "status_bar" }, [
        vue.createCommentVNode(" 这里是状态栏 ")
      ]),
      vue.createElementVNode("view", { class: "top" }, [
        vue.createVNode(_component_topSearchAndLogin, { textMsg: $data.topTitle }, null, 8, ["textMsg"])
      ]),
      vue.createElementVNode("view", { class: "user-section" }, [
        vue.createElementVNode("view", { class: "user-avatar" }, [
          vue.createElementVNode("image", {
            class: "img",
            src: _ctx.userAvatar ? _ctx.userAvatar : this.userdata.avatar,
            mode: ""
          }, null, 8, ["src"])
        ]),
        vue.createElementVNode("view", { class: "user-info" }, [
          vue.createElementVNode("view", { class: "user-name" }, [
            vue.createElementVNode(
              "text",
              { class: "name" },
              vue.toDisplayString($data.userdata.username),
              1
              /* TEXT */
            ),
            vue.createElementVNode(
              "view",
              { class: "level" },
              "   lv." + vue.toDisplayString($data.userdata.level) + "   ",
              1
              /* TEXT */
            ),
            vue.createElementVNode("view", { class: "setting" }, [
              vue.createElementVNode("image", {
                class: "img",
                src: _imports_0,
                mode: ""
              }),
              vue.createElementVNode("image", {
                class: "img",
                src: _imports_1,
                mode: ""
              })
            ])
          ]),
          vue.createElementVNode("view", { class: "identity" }, [
            vue.createElementVNode(
              "text",
              { class: "text1" },
              vue.toDisplayString($data.userdata.location),
              1
              /* TEXT */
            ),
            vue.createTextVNode("|"),
            vue.createElementVNode(
              "text",
              { class: "text2" },
              vue.toDisplayString($data.userdata.identity),
              1
              /* TEXT */
            )
          ]),
          vue.createElementVNode("view", { class: "detailed" }, [
            vue.createElementVNode(
              "text",
              null,
              "积分 " + vue.toDisplayString($data.userdata.score),
              1
              /* TEXT */
            ),
            vue.createElementVNode(
              "text",
              null,
              "粉丝 " + vue.toDisplayString($data.userdata.fans),
              1
              /* TEXT */
            ),
            vue.createElementVNode(
              "text",
              null,
              "关注 " + vue.toDisplayString($data.userdata.follow),
              1
              /* TEXT */
            ),
            vue.createElementVNode(
              "text",
              null,
              "创作 " + vue.toDisplayString($data.userdata.creatity),
              1
              /* TEXT */
            ),
            vue.createElementVNode(
              "text",
              null,
              "好友 " + vue.toDisplayString($data.userdata.friends),
              1
              /* TEXT */
            )
          ])
        ])
      ]),
      vue.createElementVNode("view", { class: "middle-section" }, [
        vue.createElementVNode("view", { class: "attendenceAndMission" }, [
          vue.createElementVNode("view", { class: "attendence" }, [
            vue.createElementVNode("image", {
              class: "img",
              src: _imports_2,
              mode: "scaleToFill"
            }),
            vue.createElementVNode("view", { class: "text" }, [
              vue.createElementVNode("text", { style: { "font-size": "21px", "font-weight": "600" } }, "每日签到"),
              vue.createElementVNode("text", { style: { "font-size": "14px" } }, "签到多多 赢福利")
            ])
          ]),
          vue.createElementVNode("view", { class: "mission" }, [
            vue.createElementVNode("image", {
              class: "img",
              src: _imports_3,
              mode: "scaleToFill"
            }),
            vue.createElementVNode("view", { class: "text" }, [
              vue.createElementVNode("text", { style: { "font-size": "21px", "font-weight": "600" } }, "精彩任务"),
              vue.createElementVNode("text", { style: { "font-size": "14px" } }, "完成任务 赢大奖")
            ])
          ])
        ]),
        vue.createElementVNode("view", { class: "startCreate" }, [
          vue.createElementVNode("view", { class: "text" }, " 开始创作 "),
          vue.createElementVNode("view", { class: "add" }, [
            vue.createElementVNode("image", {
              class: "img",
              src: _imports_4,
              mode: "scaleToFill"
            })
          ])
        ])
      ]),
      vue.createElementVNode("view", { class: "bottom-section" }, [
        vue.createElementVNode("view", { class: "title" }, [
          (vue.openBlock(true), vue.createElementBlock(
            vue.Fragment,
            null,
            vue.renderList($data.buttons, (button, index2) => {
              return vue.openBlock(), vue.createElementBlock("button", {
                key: index2,
                onClick: ($event) => $options.changeColor(index2),
                class: vue.normalizeClass({ "button-active": $data.activeIndex === index2 })
              }, vue.toDisplayString(button), 11, ["onClick"]);
            }),
            128
            /* KEYED_FRAGMENT */
          ))
        ]),
        vue.createElementVNode("view", { class: "content" }, [
          this.activeIndex === 0 ? (vue.openBlock(), vue.createBlock(_component_wrongQuestions, { key: 0 })) : vue.createCommentVNode("v-if", true)
        ])
      ]),
      vue.createElementVNode("button", {
        onClick: _cache[0] || (_cache[0] = (...args) => $options.logOut && $options.logOut(...args))
      }, "退出登录")
    ]);
  }
  const PagesMineMine = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["render", _sfc_render], ["__file", "E:/HBuilderX/Program_files/knowledge-uniapp/src/pages/mine/mine.vue"]]);
  __definePage("pages/basefunction/basefunction", PagesBasefunctionBasefunction);
  __definePage("pages/index_login/index_login", PagesIndex_loginIndex_login);
  __definePage("pages/login/login", PagesLoginLogin);
  __definePage("pages/register/register", PagesRegisterRegister);
  __definePage("pages/schoolcicle/schoolcicle", PagesSchoolcicleSchoolcicle);
  __definePage("pages/schoolcicle/verification", PagesSchoolcicleVerification);
  __definePage("pages/pertifunction/pertifunction", PagesPertifunctionPertifunction);
  __definePage("pages/mine/mine", PagesMineMine);
  const _sfc_main = {
    // globalData: {
    // 	isLoggedIn: false,
    // },
    onLaunch: function() {
      formatAppLog("log", "at App.vue:8", "App Launch");
      var token = this.$store.state.token;
      formatAppLog("log", "at App.vue:10", "token：", token);
    },
    onShow: function() {
      formatAppLog("log", "at App.vue:13", "App Show");
      this.checkLoginStatus();
    },
    onHide: function() {
      formatAppLog("log", "at App.vue:17", "App Hide");
    },
    methods: {
      // 检查登录状态
      checkLoginStatus() {
        this.$store.state.token;
        var state = this.$store.state.isLoggedIn;
        formatAppLog("log", "at App.vue:28", "登录状态：", state);
        if (state == true) {
          this.getUserInfo();
        } else {
          return;
        }
      },
      // 获取用户信息
      getUserInfo() {
        var userdataStr = uni.getStorageSync("userdata");
        if (userdataStr) {
          var userdata = JSON.parse(userdataStr);
          formatAppLog("log", "at App.vue:41", typeof userdata, userdata);
          if (userdata.headImg) {
            store.commit("setAvatar", userdata.headImg);
            formatAppLog("log", "at App.vue:45", "头像地址：", typeof userdata.headImg, userdata.headImg);
          } else {
            formatAppLog("log", "at App.vue:47", "头像地址不存在");
          }
        } else {
          this.$service.get("user-service/api/user").then((response2) => {
            formatAppLog("log", "at App.vue:53", "用户信息：", response2);
            if (response2.data.isSuccess == 1) {
              var userdata2 = response2.data.data;
              store.commit("login", userdata2);
              formatAppLog("log", "at App.vue:57", "头像地址：", response2.data.data.headImg);
            }
          }).catch((error2) => {
            formatAppLog("error", "at App.vue:62", "请求出错", error2);
          });
        }
      }
    }
  };
  const App = /* @__PURE__ */ _export_sfc(_sfc_main, [["__file", "E:/HBuilderX/Program_files/knowledge-uniapp/src/App.vue"]]);
  function bind(fn, thisArg) {
    return function wrap() {
      return fn.apply(thisArg, arguments);
    };
  }
  const { toString } = Object.prototype;
  const { getPrototypeOf } = Object;
  const kindOf = ((cache) => (thing) => {
    const str = toString.call(thing);
    return cache[str] || (cache[str] = str.slice(8, -1).toLowerCase());
  })(/* @__PURE__ */ Object.create(null));
  const kindOfTest = (type) => {
    type = type.toLowerCase();
    return (thing) => kindOf(thing) === type;
  };
  const typeOfTest = (type) => (thing) => typeof thing === type;
  const { isArray } = Array;
  const isUndefined = typeOfTest("undefined");
  function isBuffer(val) {
    return val !== null && !isUndefined(val) && val.constructor !== null && !isUndefined(val.constructor) && isFunction(val.constructor.isBuffer) && val.constructor.isBuffer(val);
  }
  const isArrayBuffer = kindOfTest("ArrayBuffer");
  function isArrayBufferView(val) {
    let result;
    if (typeof ArrayBuffer !== "undefined" && ArrayBuffer.isView) {
      result = ArrayBuffer.isView(val);
    } else {
      result = val && val.buffer && isArrayBuffer(val.buffer);
    }
    return result;
  }
  const isString = typeOfTest("string");
  const isFunction = typeOfTest("function");
  const isNumber = typeOfTest("number");
  const isObject = (thing) => thing !== null && typeof thing === "object";
  const isBoolean = (thing) => thing === true || thing === false;
  const isPlainObject = (val) => {
    if (kindOf(val) !== "object") {
      return false;
    }
    const prototype2 = getPrototypeOf(val);
    return (prototype2 === null || prototype2 === Object.prototype || Object.getPrototypeOf(prototype2) === null) && !(Symbol.toStringTag in val) && !(Symbol.iterator in val);
  };
  const isDate = kindOfTest("Date");
  const isFile = kindOfTest("File");
  const isBlob = kindOfTest("Blob");
  const isFileList = kindOfTest("FileList");
  const isStream = (val) => isObject(val) && isFunction(val.pipe);
  const isFormData = (thing) => {
    let kind;
    return thing && (typeof FormData === "function" && thing instanceof FormData || isFunction(thing.append) && ((kind = kindOf(thing)) === "formdata" || // detect form-data instance
    kind === "object" && isFunction(thing.toString) && thing.toString() === "[object FormData]"));
  };
  const isURLSearchParams = kindOfTest("URLSearchParams");
  const trim = (str) => str.trim ? str.trim() : str.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, "");
  function forEach(obj, fn, { allOwnKeys = false } = {}) {
    if (obj === null || typeof obj === "undefined") {
      return;
    }
    let i;
    let l;
    if (typeof obj !== "object") {
      obj = [obj];
    }
    if (isArray(obj)) {
      for (i = 0, l = obj.length; i < l; i++) {
        fn.call(null, obj[i], i, obj);
      }
    } else {
      const keys = allOwnKeys ? Object.getOwnPropertyNames(obj) : Object.keys(obj);
      const len = keys.length;
      let key;
      for (i = 0; i < len; i++) {
        key = keys[i];
        fn.call(null, obj[key], key, obj);
      }
    }
  }
  function findKey(obj, key) {
    key = key.toLowerCase();
    const keys = Object.keys(obj);
    let i = keys.length;
    let _key;
    while (i-- > 0) {
      _key = keys[i];
      if (key === _key.toLowerCase()) {
        return _key;
      }
    }
    return null;
  }
  const _global = (() => {
    if (typeof globalThis !== "undefined")
      return globalThis;
    return typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : global;
  })();
  const isContextDefined = (context) => !isUndefined(context) && context !== _global;
  function merge() {
    const { caseless } = isContextDefined(this) && this || {};
    const result = {};
    const assignValue = (val, key) => {
      const targetKey = caseless && findKey(result, key) || key;
      if (isPlainObject(result[targetKey]) && isPlainObject(val)) {
        result[targetKey] = merge(result[targetKey], val);
      } else if (isPlainObject(val)) {
        result[targetKey] = merge({}, val);
      } else if (isArray(val)) {
        result[targetKey] = val.slice();
      } else {
        result[targetKey] = val;
      }
    };
    for (let i = 0, l = arguments.length; i < l; i++) {
      arguments[i] && forEach(arguments[i], assignValue);
    }
    return result;
  }
  const extend = (a, b, thisArg, { allOwnKeys } = {}) => {
    forEach(b, (val, key) => {
      if (thisArg && isFunction(val)) {
        a[key] = bind(val, thisArg);
      } else {
        a[key] = val;
      }
    }, { allOwnKeys });
    return a;
  };
  const stripBOM = (content) => {
    if (content.charCodeAt(0) === 65279) {
      content = content.slice(1);
    }
    return content;
  };
  const inherits = (constructor, superConstructor, props2, descriptors2) => {
    constructor.prototype = Object.create(superConstructor.prototype, descriptors2);
    constructor.prototype.constructor = constructor;
    Object.defineProperty(constructor, "super", {
      value: superConstructor.prototype
    });
    props2 && Object.assign(constructor.prototype, props2);
  };
  const toFlatObject = (sourceObj, destObj, filter, propFilter) => {
    let props2;
    let i;
    let prop;
    const merged = {};
    destObj = destObj || {};
    if (sourceObj == null)
      return destObj;
    do {
      props2 = Object.getOwnPropertyNames(sourceObj);
      i = props2.length;
      while (i-- > 0) {
        prop = props2[i];
        if ((!propFilter || propFilter(prop, sourceObj, destObj)) && !merged[prop]) {
          destObj[prop] = sourceObj[prop];
          merged[prop] = true;
        }
      }
      sourceObj = filter !== false && getPrototypeOf(sourceObj);
    } while (sourceObj && (!filter || filter(sourceObj, destObj)) && sourceObj !== Object.prototype);
    return destObj;
  };
  const endsWith = (str, searchString, position) => {
    str = String(str);
    if (position === void 0 || position > str.length) {
      position = str.length;
    }
    position -= searchString.length;
    const lastIndex = str.indexOf(searchString, position);
    return lastIndex !== -1 && lastIndex === position;
  };
  const toArray = (thing) => {
    if (!thing)
      return null;
    if (isArray(thing))
      return thing;
    let i = thing.length;
    if (!isNumber(i))
      return null;
    const arr = new Array(i);
    while (i-- > 0) {
      arr[i] = thing[i];
    }
    return arr;
  };
  const isTypedArray = ((TypedArray) => {
    return (thing) => {
      return TypedArray && thing instanceof TypedArray;
    };
  })(typeof Uint8Array !== "undefined" && getPrototypeOf(Uint8Array));
  const forEachEntry = (obj, fn) => {
    const generator = obj && obj[Symbol.iterator];
    const iterator = generator.call(obj);
    let result;
    while ((result = iterator.next()) && !result.done) {
      const pair = result.value;
      fn.call(obj, pair[0], pair[1]);
    }
  };
  const matchAll = (regExp2, str) => {
    let matches;
    const arr = [];
    while ((matches = regExp2.exec(str)) !== null) {
      arr.push(matches);
    }
    return arr;
  };
  const isHTMLForm = kindOfTest("HTMLFormElement");
  const toCamelCase = (str) => {
    return str.toLowerCase().replace(
      /[-_\s]([a-z\d])(\w*)/g,
      function replacer(m, p1, p2) {
        return p1.toUpperCase() + p2;
      }
    );
  };
  const hasOwnProperty = (({ hasOwnProperty: hasOwnProperty2 }) => (obj, prop) => hasOwnProperty2.call(obj, prop))(Object.prototype);
  const isRegExp = kindOfTest("RegExp");
  const reduceDescriptors = (obj, reducer) => {
    const descriptors2 = Object.getOwnPropertyDescriptors(obj);
    const reducedDescriptors = {};
    forEach(descriptors2, (descriptor, name) => {
      let ret;
      if ((ret = reducer(descriptor, name, obj)) !== false) {
        reducedDescriptors[name] = ret || descriptor;
      }
    });
    Object.defineProperties(obj, reducedDescriptors);
  };
  const freezeMethods = (obj) => {
    reduceDescriptors(obj, (descriptor, name) => {
      if (isFunction(obj) && ["arguments", "caller", "callee"].indexOf(name) !== -1) {
        return false;
      }
      const value = obj[name];
      if (!isFunction(value))
        return;
      descriptor.enumerable = false;
      if ("writable" in descriptor) {
        descriptor.writable = false;
        return;
      }
      if (!descriptor.set) {
        descriptor.set = () => {
          throw Error("Can not rewrite read-only method '" + name + "'");
        };
      }
    });
  };
  const toObjectSet = (arrayOrString, delimiter) => {
    const obj = {};
    const define = (arr) => {
      arr.forEach((value) => {
        obj[value] = true;
      });
    };
    isArray(arrayOrString) ? define(arrayOrString) : define(String(arrayOrString).split(delimiter));
    return obj;
  };
  const noop = () => {
  };
  const toFiniteNumber = (value, defaultValue) => {
    value = +value;
    return Number.isFinite(value) ? value : defaultValue;
  };
  const ALPHA = "abcdefghijklmnopqrstuvwxyz";
  const DIGIT = "0123456789";
  const ALPHABET = {
    DIGIT,
    ALPHA,
    ALPHA_DIGIT: ALPHA + ALPHA.toUpperCase() + DIGIT
  };
  const generateString = (size = 16, alphabet = ALPHABET.ALPHA_DIGIT) => {
    let str = "";
    const { length } = alphabet;
    while (size--) {
      str += alphabet[Math.random() * length | 0];
    }
    return str;
  };
  function isSpecCompliantForm(thing) {
    return !!(thing && isFunction(thing.append) && thing[Symbol.toStringTag] === "FormData" && thing[Symbol.iterator]);
  }
  const toJSONObject = (obj) => {
    const stack = new Array(10);
    const visit = (source, i) => {
      if (isObject(source)) {
        if (stack.indexOf(source) >= 0) {
          return;
        }
        if (!("toJSON" in source)) {
          stack[i] = source;
          const target = isArray(source) ? [] : {};
          forEach(source, (value, key) => {
            const reducedValue = visit(value, i + 1);
            !isUndefined(reducedValue) && (target[key] = reducedValue);
          });
          stack[i] = void 0;
          return target;
        }
      }
      return source;
    };
    return visit(obj, 0);
  };
  const isAsyncFn = kindOfTest("AsyncFunction");
  const isThenable = (thing) => thing && (isObject(thing) || isFunction(thing)) && isFunction(thing.then) && isFunction(thing.catch);
  const utils$1 = {
    isArray,
    isArrayBuffer,
    isBuffer,
    isFormData,
    isArrayBufferView,
    isString,
    isNumber,
    isBoolean,
    isObject,
    isPlainObject,
    isUndefined,
    isDate,
    isFile,
    isBlob,
    isRegExp,
    isFunction,
    isStream,
    isURLSearchParams,
    isTypedArray,
    isFileList,
    forEach,
    merge,
    extend,
    trim,
    stripBOM,
    inherits,
    toFlatObject,
    kindOf,
    kindOfTest,
    endsWith,
    toArray,
    forEachEntry,
    matchAll,
    isHTMLForm,
    hasOwnProperty,
    hasOwnProp: hasOwnProperty,
    // an alias to avoid ESLint no-prototype-builtins detection
    reduceDescriptors,
    freezeMethods,
    toObjectSet,
    toCamelCase,
    noop,
    toFiniteNumber,
    findKey,
    global: _global,
    isContextDefined,
    ALPHABET,
    generateString,
    isSpecCompliantForm,
    toJSONObject,
    isAsyncFn,
    isThenable
  };
  function AxiosError(message, code2, config, request, response2) {
    Error.call(this);
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    } else {
      this.stack = new Error().stack;
    }
    this.message = message;
    this.name = "AxiosError";
    code2 && (this.code = code2);
    config && (this.config = config);
    request && (this.request = request);
    response2 && (this.response = response2);
  }
  utils$1.inherits(AxiosError, Error, {
    toJSON: function toJSON() {
      return {
        // Standard
        message: this.message,
        name: this.name,
        // Microsoft
        description: this.description,
        number: this.number,
        // Mozilla
        fileName: this.fileName,
        lineNumber: this.lineNumber,
        columnNumber: this.columnNumber,
        stack: this.stack,
        // Axios
        config: utils$1.toJSONObject(this.config),
        code: this.code,
        status: this.response && this.response.status ? this.response.status : null
      };
    }
  });
  const prototype$1 = AxiosError.prototype;
  const descriptors = {};
  [
    "ERR_BAD_OPTION_VALUE",
    "ERR_BAD_OPTION",
    "ECONNABORTED",
    "ETIMEDOUT",
    "ERR_NETWORK",
    "ERR_FR_TOO_MANY_REDIRECTS",
    "ERR_DEPRECATED",
    "ERR_BAD_RESPONSE",
    "ERR_BAD_REQUEST",
    "ERR_CANCELED",
    "ERR_NOT_SUPPORT",
    "ERR_INVALID_URL"
    // eslint-disable-next-line func-names
  ].forEach((code2) => {
    descriptors[code2] = { value: code2 };
  });
  Object.defineProperties(AxiosError, descriptors);
  Object.defineProperty(prototype$1, "isAxiosError", { value: true });
  AxiosError.from = (error2, code2, config, request, response2, customProps) => {
    const axiosError = Object.create(prototype$1);
    utils$1.toFlatObject(error2, axiosError, function filter(obj) {
      return obj !== Error.prototype;
    }, (prop) => {
      return prop !== "isAxiosError";
    });
    AxiosError.call(axiosError, error2.message, code2, config, request, response2);
    axiosError.cause = error2;
    axiosError.name = error2.name;
    customProps && Object.assign(axiosError, customProps);
    return axiosError;
  };
  const httpAdapter = null;
  function isVisitable(thing) {
    return utils$1.isPlainObject(thing) || utils$1.isArray(thing);
  }
  function removeBrackets(key) {
    return utils$1.endsWith(key, "[]") ? key.slice(0, -2) : key;
  }
  function renderKey(path, key, dots) {
    if (!path)
      return key;
    return path.concat(key).map(function each(token, i) {
      token = removeBrackets(token);
      return !dots && i ? "[" + token + "]" : token;
    }).join(dots ? "." : "");
  }
  function isFlatArray(arr) {
    return utils$1.isArray(arr) && !arr.some(isVisitable);
  }
  const predicates = utils$1.toFlatObject(utils$1, {}, null, function filter(prop) {
    return /^is[A-Z]/.test(prop);
  });
  function toFormData(obj, formData, options) {
    if (!utils$1.isObject(obj)) {
      throw new TypeError("target must be an object");
    }
    formData = formData || new FormData();
    options = utils$1.toFlatObject(options, {
      metaTokens: true,
      dots: false,
      indexes: false
    }, false, function defined(option, source) {
      return !utils$1.isUndefined(source[option]);
    });
    const metaTokens = options.metaTokens;
    const visitor = options.visitor || defaultVisitor;
    const dots = options.dots;
    const indexes = options.indexes;
    const _Blob = options.Blob || typeof Blob !== "undefined" && Blob;
    const useBlob = _Blob && utils$1.isSpecCompliantForm(formData);
    if (!utils$1.isFunction(visitor)) {
      throw new TypeError("visitor must be a function");
    }
    function convertValue(value) {
      if (value === null)
        return "";
      if (utils$1.isDate(value)) {
        return value.toISOString();
      }
      if (!useBlob && utils$1.isBlob(value)) {
        throw new AxiosError("Blob is not supported. Use a Buffer instead.");
      }
      if (utils$1.isArrayBuffer(value) || utils$1.isTypedArray(value)) {
        return useBlob && typeof Blob === "function" ? new Blob([value]) : Buffer.from(value);
      }
      return value;
    }
    function defaultVisitor(value, key, path) {
      let arr = value;
      if (value && !path && typeof value === "object") {
        if (utils$1.endsWith(key, "{}")) {
          key = metaTokens ? key : key.slice(0, -2);
          value = JSON.stringify(value);
        } else if (utils$1.isArray(value) && isFlatArray(value) || (utils$1.isFileList(value) || utils$1.endsWith(key, "[]")) && (arr = utils$1.toArray(value))) {
          key = removeBrackets(key);
          arr.forEach(function each(el, index2) {
            !(utils$1.isUndefined(el) || el === null) && formData.append(
              // eslint-disable-next-line no-nested-ternary
              indexes === true ? renderKey([key], index2, dots) : indexes === null ? key : key + "[]",
              convertValue(el)
            );
          });
          return false;
        }
      }
      if (isVisitable(value)) {
        return true;
      }
      formData.append(renderKey(path, key, dots), convertValue(value));
      return false;
    }
    const stack = [];
    const exposedHelpers = Object.assign(predicates, {
      defaultVisitor,
      convertValue,
      isVisitable
    });
    function build(value, path) {
      if (utils$1.isUndefined(value))
        return;
      if (stack.indexOf(value) !== -1) {
        throw Error("Circular reference detected in " + path.join("."));
      }
      stack.push(value);
      utils$1.forEach(value, function each(el, key) {
        const result = !(utils$1.isUndefined(el) || el === null) && visitor.call(
          formData,
          el,
          utils$1.isString(key) ? key.trim() : key,
          path,
          exposedHelpers
        );
        if (result === true) {
          build(el, path ? path.concat(key) : [key]);
        }
      });
      stack.pop();
    }
    if (!utils$1.isObject(obj)) {
      throw new TypeError("data must be an object");
    }
    build(obj);
    return formData;
  }
  function encode$1(str) {
    const charMap = {
      "!": "%21",
      "'": "%27",
      "(": "%28",
      ")": "%29",
      "~": "%7E",
      "%20": "+",
      "%00": "\0"
    };
    return encodeURIComponent(str).replace(/[!'()~]|%20|%00/g, function replacer(match) {
      return charMap[match];
    });
  }
  function AxiosURLSearchParams(params, options) {
    this._pairs = [];
    params && toFormData(params, this, options);
  }
  const prototype = AxiosURLSearchParams.prototype;
  prototype.append = function append(name, value) {
    this._pairs.push([name, value]);
  };
  prototype.toString = function toString2(encoder) {
    const _encode = encoder ? function(value) {
      return encoder.call(this, value, encode$1);
    } : encode$1;
    return this._pairs.map(function each(pair) {
      return _encode(pair[0]) + "=" + _encode(pair[1]);
    }, "").join("&");
  };
  function encode(val) {
    return encodeURIComponent(val).replace(/%3A/gi, ":").replace(/%24/g, "$").replace(/%2C/gi, ",").replace(/%20/g, "+").replace(/%5B/gi, "[").replace(/%5D/gi, "]");
  }
  function buildURL(url2, params, options) {
    if (!params) {
      return url2;
    }
    const _encode = options && options.encode || encode;
    const serializeFn = options && options.serialize;
    let serializedParams;
    if (serializeFn) {
      serializedParams = serializeFn(params, options);
    } else {
      serializedParams = utils$1.isURLSearchParams(params) ? params.toString() : new AxiosURLSearchParams(params, options).toString(_encode);
    }
    if (serializedParams) {
      const hashmarkIndex = url2.indexOf("#");
      if (hashmarkIndex !== -1) {
        url2 = url2.slice(0, hashmarkIndex);
      }
      url2 += (url2.indexOf("?") === -1 ? "?" : "&") + serializedParams;
    }
    return url2;
  }
  class InterceptorManager {
    constructor() {
      this.handlers = [];
    }
    /**
     * Add a new interceptor to the stack
     *
     * @param {Function} fulfilled The function to handle `then` for a `Promise`
     * @param {Function} rejected The function to handle `reject` for a `Promise`
     *
     * @return {Number} An ID used to remove interceptor later
     */
    use(fulfilled, rejected, options) {
      this.handlers.push({
        fulfilled,
        rejected,
        synchronous: options ? options.synchronous : false,
        runWhen: options ? options.runWhen : null
      });
      return this.handlers.length - 1;
    }
    /**
     * Remove an interceptor from the stack
     *
     * @param {Number} id The ID that was returned by `use`
     *
     * @returns {Boolean} `true` if the interceptor was removed, `false` otherwise
     */
    eject(id) {
      if (this.handlers[id]) {
        this.handlers[id] = null;
      }
    }
    /**
     * Clear all interceptors from the stack
     *
     * @returns {void}
     */
    clear() {
      if (this.handlers) {
        this.handlers = [];
      }
    }
    /**
     * Iterate over all the registered interceptors
     *
     * This method is particularly useful for skipping over any
     * interceptors that may have become `null` calling `eject`.
     *
     * @param {Function} fn The function to call for each interceptor
     *
     * @returns {void}
     */
    forEach(fn) {
      utils$1.forEach(this.handlers, function forEachHandler(h) {
        if (h !== null) {
          fn(h);
        }
      });
    }
  }
  const InterceptorManager$1 = InterceptorManager;
  const transitionalDefaults = {
    silentJSONParsing: true,
    forcedJSONParsing: true,
    clarifyTimeoutError: false
  };
  const URLSearchParams$1 = typeof URLSearchParams !== "undefined" ? URLSearchParams : AxiosURLSearchParams;
  const FormData$1 = typeof FormData !== "undefined" ? FormData : null;
  const Blob$1 = typeof Blob !== "undefined" ? Blob : null;
  const platform$1 = {
    isBrowser: true,
    classes: {
      URLSearchParams: URLSearchParams$1,
      FormData: FormData$1,
      Blob: Blob$1
    },
    protocols: ["http", "https", "file", "blob", "url", "data"]
  };
  const hasBrowserEnv = typeof window !== "undefined" && typeof document !== "undefined";
  const hasStandardBrowserEnv = ((product) => {
    return hasBrowserEnv && ["ReactNative", "NativeScript", "NS"].indexOf(product) < 0;
  })(typeof navigator !== "undefined" && navigator.product);
  const hasStandardBrowserWebWorkerEnv = (() => {
    return typeof WorkerGlobalScope !== "undefined" && // eslint-disable-next-line no-undef
    self instanceof WorkerGlobalScope && typeof self.importScripts === "function";
  })();
  const utils = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
    __proto__: null,
    hasBrowserEnv,
    hasStandardBrowserEnv,
    hasStandardBrowserWebWorkerEnv
  }, Symbol.toStringTag, { value: "Module" }));
  const platform = {
    ...utils,
    ...platform$1
  };
  function toURLEncodedForm(data, options) {
    return toFormData(data, new platform.classes.URLSearchParams(), Object.assign({
      visitor: function(value, key, path, helpers) {
        if (platform.isNode && utils$1.isBuffer(value)) {
          this.append(key, value.toString("base64"));
          return false;
        }
        return helpers.defaultVisitor.apply(this, arguments);
      }
    }, options));
  }
  function parsePropPath(name) {
    return utils$1.matchAll(/\w+|\[(\w*)]/g, name).map((match) => {
      return match[0] === "[]" ? "" : match[1] || match[0];
    });
  }
  function arrayToObject(arr) {
    const obj = {};
    const keys = Object.keys(arr);
    let i;
    const len = keys.length;
    let key;
    for (i = 0; i < len; i++) {
      key = keys[i];
      obj[key] = arr[key];
    }
    return obj;
  }
  function formDataToJSON(formData) {
    function buildPath(path, value, target, index2) {
      let name = path[index2++];
      if (name === "__proto__")
        return true;
      const isNumericKey = Number.isFinite(+name);
      const isLast = index2 >= path.length;
      name = !name && utils$1.isArray(target) ? target.length : name;
      if (isLast) {
        if (utils$1.hasOwnProp(target, name)) {
          target[name] = [target[name], value];
        } else {
          target[name] = value;
        }
        return !isNumericKey;
      }
      if (!target[name] || !utils$1.isObject(target[name])) {
        target[name] = [];
      }
      const result = buildPath(path, value, target[name], index2);
      if (result && utils$1.isArray(target[name])) {
        target[name] = arrayToObject(target[name]);
      }
      return !isNumericKey;
    }
    if (utils$1.isFormData(formData) && utils$1.isFunction(formData.entries)) {
      const obj = {};
      utils$1.forEachEntry(formData, (name, value) => {
        buildPath(parsePropPath(name), value, obj, 0);
      });
      return obj;
    }
    return null;
  }
  function stringifySafely(rawValue, parser, encoder) {
    if (utils$1.isString(rawValue)) {
      try {
        (parser || JSON.parse)(rawValue);
        return utils$1.trim(rawValue);
      } catch (e) {
        if (e.name !== "SyntaxError") {
          throw e;
        }
      }
    }
    return (encoder || JSON.stringify)(rawValue);
  }
  const defaults = {
    transitional: transitionalDefaults,
    adapter: ["xhr", "http"],
    transformRequest: [function transformRequest(data, headers) {
      const contentType = headers.getContentType() || "";
      const hasJSONContentType = contentType.indexOf("application/json") > -1;
      const isObjectPayload = utils$1.isObject(data);
      if (isObjectPayload && utils$1.isHTMLForm(data)) {
        data = new FormData(data);
      }
      const isFormData2 = utils$1.isFormData(data);
      if (isFormData2) {
        if (!hasJSONContentType) {
          return data;
        }
        return hasJSONContentType ? JSON.stringify(formDataToJSON(data)) : data;
      }
      if (utils$1.isArrayBuffer(data) || utils$1.isBuffer(data) || utils$1.isStream(data) || utils$1.isFile(data) || utils$1.isBlob(data)) {
        return data;
      }
      if (utils$1.isArrayBufferView(data)) {
        return data.buffer;
      }
      if (utils$1.isURLSearchParams(data)) {
        headers.setContentType("application/x-www-form-urlencoded;charset=utf-8", false);
        return data.toString();
      }
      let isFileList2;
      if (isObjectPayload) {
        if (contentType.indexOf("application/x-www-form-urlencoded") > -1) {
          return toURLEncodedForm(data, this.formSerializer).toString();
        }
        if ((isFileList2 = utils$1.isFileList(data)) || contentType.indexOf("multipart/form-data") > -1) {
          const _FormData = this.env && this.env.FormData;
          return toFormData(
            isFileList2 ? { "files[]": data } : data,
            _FormData && new _FormData(),
            this.formSerializer
          );
        }
      }
      if (isObjectPayload || hasJSONContentType) {
        headers.setContentType("application/json", false);
        return stringifySafely(data);
      }
      return data;
    }],
    transformResponse: [function transformResponse(data) {
      const transitional = this.transitional || defaults.transitional;
      const forcedJSONParsing = transitional && transitional.forcedJSONParsing;
      const JSONRequested = this.responseType === "json";
      if (data && utils$1.isString(data) && (forcedJSONParsing && !this.responseType || JSONRequested)) {
        const silentJSONParsing = transitional && transitional.silentJSONParsing;
        const strictJSONParsing = !silentJSONParsing && JSONRequested;
        try {
          return JSON.parse(data);
        } catch (e) {
          if (strictJSONParsing) {
            if (e.name === "SyntaxError") {
              throw AxiosError.from(e, AxiosError.ERR_BAD_RESPONSE, this, null, this.response);
            }
            throw e;
          }
        }
      }
      return data;
    }],
    /**
     * A timeout in milliseconds to abort a request. If set to 0 (default) a
     * timeout is not created.
     */
    timeout: 0,
    xsrfCookieName: "XSRF-TOKEN",
    xsrfHeaderName: "X-XSRF-TOKEN",
    maxContentLength: -1,
    maxBodyLength: -1,
    env: {
      FormData: platform.classes.FormData,
      Blob: platform.classes.Blob
    },
    validateStatus: function validateStatus(status) {
      return status >= 200 && status < 300;
    },
    headers: {
      common: {
        "Accept": "application/json, text/plain, */*",
        "Content-Type": void 0
      }
    }
  };
  utils$1.forEach(["delete", "get", "head", "post", "put", "patch"], (method) => {
    defaults.headers[method] = {};
  });
  const defaults$1 = defaults;
  const ignoreDuplicateOf = utils$1.toObjectSet([
    "age",
    "authorization",
    "content-length",
    "content-type",
    "etag",
    "expires",
    "from",
    "host",
    "if-modified-since",
    "if-unmodified-since",
    "last-modified",
    "location",
    "max-forwards",
    "proxy-authorization",
    "referer",
    "retry-after",
    "user-agent"
  ]);
  const parseHeaders = (rawHeaders) => {
    const parsed = {};
    let key;
    let val;
    let i;
    rawHeaders && rawHeaders.split("\n").forEach(function parser(line) {
      i = line.indexOf(":");
      key = line.substring(0, i).trim().toLowerCase();
      val = line.substring(i + 1).trim();
      if (!key || parsed[key] && ignoreDuplicateOf[key]) {
        return;
      }
      if (key === "set-cookie") {
        if (parsed[key]) {
          parsed[key].push(val);
        } else {
          parsed[key] = [val];
        }
      } else {
        parsed[key] = parsed[key] ? parsed[key] + ", " + val : val;
      }
    });
    return parsed;
  };
  const $internals = Symbol("internals");
  function normalizeHeader(header) {
    return header && String(header).trim().toLowerCase();
  }
  function normalizeValue(value) {
    if (value === false || value == null) {
      return value;
    }
    return utils$1.isArray(value) ? value.map(normalizeValue) : String(value);
  }
  function parseTokens(str) {
    const tokens = /* @__PURE__ */ Object.create(null);
    const tokensRE = /([^\s,;=]+)\s*(?:=\s*([^,;]+))?/g;
    let match;
    while (match = tokensRE.exec(str)) {
      tokens[match[1]] = match[2];
    }
    return tokens;
  }
  const isValidHeaderName = (str) => /^[-_a-zA-Z0-9^`|~,!#$%&'*+.]+$/.test(str.trim());
  function matchHeaderValue(context, value, header, filter, isHeaderNameFilter) {
    if (utils$1.isFunction(filter)) {
      return filter.call(this, value, header);
    }
    if (isHeaderNameFilter) {
      value = header;
    }
    if (!utils$1.isString(value))
      return;
    if (utils$1.isString(filter)) {
      return value.indexOf(filter) !== -1;
    }
    if (utils$1.isRegExp(filter)) {
      return filter.test(value);
    }
  }
  function formatHeader(header) {
    return header.trim().toLowerCase().replace(/([a-z\d])(\w*)/g, (w, char, str) => {
      return char.toUpperCase() + str;
    });
  }
  function buildAccessors(obj, header) {
    const accessorName = utils$1.toCamelCase(" " + header);
    ["get", "set", "has"].forEach((methodName) => {
      Object.defineProperty(obj, methodName + accessorName, {
        value: function(arg1, arg2, arg3) {
          return this[methodName].call(this, header, arg1, arg2, arg3);
        },
        configurable: true
      });
    });
  }
  class AxiosHeaders {
    constructor(headers) {
      headers && this.set(headers);
    }
    set(header, valueOrRewrite, rewrite) {
      const self2 = this;
      function setHeader(_value, _header, _rewrite) {
        const lHeader = normalizeHeader(_header);
        if (!lHeader) {
          throw new Error("header name must be a non-empty string");
        }
        const key = utils$1.findKey(self2, lHeader);
        if (!key || self2[key] === void 0 || _rewrite === true || _rewrite === void 0 && self2[key] !== false) {
          self2[key || _header] = normalizeValue(_value);
        }
      }
      const setHeaders = (headers, _rewrite) => utils$1.forEach(headers, (_value, _header) => setHeader(_value, _header, _rewrite));
      if (utils$1.isPlainObject(header) || header instanceof this.constructor) {
        setHeaders(header, valueOrRewrite);
      } else if (utils$1.isString(header) && (header = header.trim()) && !isValidHeaderName(header)) {
        setHeaders(parseHeaders(header), valueOrRewrite);
      } else {
        header != null && setHeader(valueOrRewrite, header, rewrite);
      }
      return this;
    }
    get(header, parser) {
      header = normalizeHeader(header);
      if (header) {
        const key = utils$1.findKey(this, header);
        if (key) {
          const value = this[key];
          if (!parser) {
            return value;
          }
          if (parser === true) {
            return parseTokens(value);
          }
          if (utils$1.isFunction(parser)) {
            return parser.call(this, value, key);
          }
          if (utils$1.isRegExp(parser)) {
            return parser.exec(value);
          }
          throw new TypeError("parser must be boolean|regexp|function");
        }
      }
    }
    has(header, matcher) {
      header = normalizeHeader(header);
      if (header) {
        const key = utils$1.findKey(this, header);
        return !!(key && this[key] !== void 0 && (!matcher || matchHeaderValue(this, this[key], key, matcher)));
      }
      return false;
    }
    delete(header, matcher) {
      const self2 = this;
      let deleted = false;
      function deleteHeader(_header) {
        _header = normalizeHeader(_header);
        if (_header) {
          const key = utils$1.findKey(self2, _header);
          if (key && (!matcher || matchHeaderValue(self2, self2[key], key, matcher))) {
            delete self2[key];
            deleted = true;
          }
        }
      }
      if (utils$1.isArray(header)) {
        header.forEach(deleteHeader);
      } else {
        deleteHeader(header);
      }
      return deleted;
    }
    clear(matcher) {
      const keys = Object.keys(this);
      let i = keys.length;
      let deleted = false;
      while (i--) {
        const key = keys[i];
        if (!matcher || matchHeaderValue(this, this[key], key, matcher, true)) {
          delete this[key];
          deleted = true;
        }
      }
      return deleted;
    }
    normalize(format) {
      const self2 = this;
      const headers = {};
      utils$1.forEach(this, (value, header) => {
        const key = utils$1.findKey(headers, header);
        if (key) {
          self2[key] = normalizeValue(value);
          delete self2[header];
          return;
        }
        const normalized = format ? formatHeader(header) : String(header).trim();
        if (normalized !== header) {
          delete self2[header];
        }
        self2[normalized] = normalizeValue(value);
        headers[normalized] = true;
      });
      return this;
    }
    concat(...targets) {
      return this.constructor.concat(this, ...targets);
    }
    toJSON(asStrings) {
      const obj = /* @__PURE__ */ Object.create(null);
      utils$1.forEach(this, (value, header) => {
        value != null && value !== false && (obj[header] = asStrings && utils$1.isArray(value) ? value.join(", ") : value);
      });
      return obj;
    }
    [Symbol.iterator]() {
      return Object.entries(this.toJSON())[Symbol.iterator]();
    }
    toString() {
      return Object.entries(this.toJSON()).map(([header, value]) => header + ": " + value).join("\n");
    }
    get [Symbol.toStringTag]() {
      return "AxiosHeaders";
    }
    static from(thing) {
      return thing instanceof this ? thing : new this(thing);
    }
    static concat(first, ...targets) {
      const computed = new this(first);
      targets.forEach((target) => computed.set(target));
      return computed;
    }
    static accessor(header) {
      const internals = this[$internals] = this[$internals] = {
        accessors: {}
      };
      const accessors = internals.accessors;
      const prototype2 = this.prototype;
      function defineAccessor(_header) {
        const lHeader = normalizeHeader(_header);
        if (!accessors[lHeader]) {
          buildAccessors(prototype2, _header);
          accessors[lHeader] = true;
        }
      }
      utils$1.isArray(header) ? header.forEach(defineAccessor) : defineAccessor(header);
      return this;
    }
  }
  AxiosHeaders.accessor(["Content-Type", "Content-Length", "Accept", "Accept-Encoding", "User-Agent", "Authorization"]);
  utils$1.reduceDescriptors(AxiosHeaders.prototype, ({ value }, key) => {
    let mapped = key[0].toUpperCase() + key.slice(1);
    return {
      get: () => value,
      set(headerValue) {
        this[mapped] = headerValue;
      }
    };
  });
  utils$1.freezeMethods(AxiosHeaders);
  const AxiosHeaders$1 = AxiosHeaders;
  function transformData(fns, response2) {
    const config = this || defaults$1;
    const context = response2 || config;
    const headers = AxiosHeaders$1.from(context.headers);
    let data = context.data;
    utils$1.forEach(fns, function transform(fn) {
      data = fn.call(config, data, headers.normalize(), response2 ? response2.status : void 0);
    });
    headers.normalize();
    return data;
  }
  function isCancel(value) {
    return !!(value && value.__CANCEL__);
  }
  function CanceledError(message, config, request) {
    AxiosError.call(this, message == null ? "canceled" : message, AxiosError.ERR_CANCELED, config, request);
    this.name = "CanceledError";
  }
  utils$1.inherits(CanceledError, AxiosError, {
    __CANCEL__: true
  });
  function settle(resolve, reject, response2) {
    const validateStatus = response2.config.validateStatus;
    if (!response2.status || !validateStatus || validateStatus(response2.status)) {
      resolve(response2);
    } else {
      reject(new AxiosError(
        "Request failed with status code " + response2.status,
        [AxiosError.ERR_BAD_REQUEST, AxiosError.ERR_BAD_RESPONSE][Math.floor(response2.status / 100) - 4],
        response2.config,
        response2.request,
        response2
      ));
    }
  }
  const cookies = platform.hasStandardBrowserEnv ? (
    // Standard browser envs support document.cookie
    {
      write(name, value, expires, path, domain, secure) {
        const cookie = [name + "=" + encodeURIComponent(value)];
        utils$1.isNumber(expires) && cookie.push("expires=" + new Date(expires).toGMTString());
        utils$1.isString(path) && cookie.push("path=" + path);
        utils$1.isString(domain) && cookie.push("domain=" + domain);
        secure === true && cookie.push("secure");
        document.cookie = cookie.join("; ");
      },
      read(name) {
        const match = document.cookie.match(new RegExp("(^|;\\s*)(" + name + ")=([^;]*)"));
        return match ? decodeURIComponent(match[3]) : null;
      },
      remove(name) {
        this.write(name, "", Date.now() - 864e5);
      }
    }
  ) : (
    // Non-standard browser env (web workers, react-native) lack needed support.
    {
      write() {
      },
      read() {
        return null;
      },
      remove() {
      }
    }
  );
  function isAbsoluteURL(url2) {
    return /^([a-z][a-z\d+\-.]*:)?\/\//i.test(url2);
  }
  function combineURLs(baseURL, relativeURL) {
    return relativeURL ? baseURL.replace(/\/?\/$/, "") + "/" + relativeURL.replace(/^\/+/, "") : baseURL;
  }
  function buildFullPath(baseURL, requestedURL) {
    if (baseURL && !isAbsoluteURL(requestedURL)) {
      return combineURLs(baseURL, requestedURL);
    }
    return requestedURL;
  }
  const isURLSameOrigin = platform.hasStandardBrowserEnv ? (
    // Standard browser envs have full support of the APIs needed to test
    // whether the request URL is of the same origin as current location.
    function standardBrowserEnv() {
      const msie = /(msie|trident)/i.test(navigator.userAgent);
      const urlParsingNode = document.createElement("a");
      let originURL;
      function resolveURL(url2) {
        let href = url2;
        if (msie) {
          urlParsingNode.setAttribute("href", href);
          href = urlParsingNode.href;
        }
        urlParsingNode.setAttribute("href", href);
        return {
          href: urlParsingNode.href,
          protocol: urlParsingNode.protocol ? urlParsingNode.protocol.replace(/:$/, "") : "",
          host: urlParsingNode.host,
          search: urlParsingNode.search ? urlParsingNode.search.replace(/^\?/, "") : "",
          hash: urlParsingNode.hash ? urlParsingNode.hash.replace(/^#/, "") : "",
          hostname: urlParsingNode.hostname,
          port: urlParsingNode.port,
          pathname: urlParsingNode.pathname.charAt(0) === "/" ? urlParsingNode.pathname : "/" + urlParsingNode.pathname
        };
      }
      originURL = resolveURL(window.location.href);
      return function isURLSameOrigin2(requestURL) {
        const parsed = utils$1.isString(requestURL) ? resolveURL(requestURL) : requestURL;
        return parsed.protocol === originURL.protocol && parsed.host === originURL.host;
      };
    }()
  ) : (
    // Non standard browser envs (web workers, react-native) lack needed support.
    function nonStandardBrowserEnv() {
      return function isURLSameOrigin2() {
        return true;
      };
    }()
  );
  function parseProtocol(url2) {
    const match = /^([-+\w]{1,25})(:?\/\/|:)/.exec(url2);
    return match && match[1] || "";
  }
  function speedometer(samplesCount, min) {
    samplesCount = samplesCount || 10;
    const bytes = new Array(samplesCount);
    const timestamps = new Array(samplesCount);
    let head = 0;
    let tail = 0;
    let firstSampleTS;
    min = min !== void 0 ? min : 1e3;
    return function push(chunkLength) {
      const now2 = Date.now();
      const startedAt = timestamps[tail];
      if (!firstSampleTS) {
        firstSampleTS = now2;
      }
      bytes[head] = chunkLength;
      timestamps[head] = now2;
      let i = tail;
      let bytesCount = 0;
      while (i !== head) {
        bytesCount += bytes[i++];
        i = i % samplesCount;
      }
      head = (head + 1) % samplesCount;
      if (head === tail) {
        tail = (tail + 1) % samplesCount;
      }
      if (now2 - firstSampleTS < min) {
        return;
      }
      const passed = startedAt && now2 - startedAt;
      return passed ? Math.round(bytesCount * 1e3 / passed) : void 0;
    };
  }
  function progressEventReducer(listener, isDownloadStream) {
    let bytesNotified = 0;
    const _speedometer = speedometer(50, 250);
    return (e) => {
      const loaded = e.loaded;
      const total = e.lengthComputable ? e.total : void 0;
      const progressBytes = loaded - bytesNotified;
      const rate = _speedometer(progressBytes);
      const inRange = loaded <= total;
      bytesNotified = loaded;
      const data = {
        loaded,
        total,
        progress: total ? loaded / total : void 0,
        bytes: progressBytes,
        rate: rate ? rate : void 0,
        estimated: rate && total && inRange ? (total - loaded) / rate : void 0,
        event: e
      };
      data[isDownloadStream ? "download" : "upload"] = true;
      listener(data);
    };
  }
  const isXHRAdapterSupported = typeof XMLHttpRequest !== "undefined";
  const xhrAdapter = isXHRAdapterSupported && function(config) {
    return new Promise(function dispatchXhrRequest(resolve, reject) {
      let requestData = config.data;
      const requestHeaders = AxiosHeaders$1.from(config.headers).normalize();
      let { responseType, withXSRFToken } = config;
      let onCanceled;
      function done() {
        if (config.cancelToken) {
          config.cancelToken.unsubscribe(onCanceled);
        }
        if (config.signal) {
          config.signal.removeEventListener("abort", onCanceled);
        }
      }
      let contentType;
      if (utils$1.isFormData(requestData)) {
        if (platform.hasStandardBrowserEnv || platform.hasStandardBrowserWebWorkerEnv) {
          requestHeaders.setContentType(false);
        } else if ((contentType = requestHeaders.getContentType()) !== false) {
          const [type, ...tokens] = contentType ? contentType.split(";").map((token) => token.trim()).filter(Boolean) : [];
          requestHeaders.setContentType([type || "multipart/form-data", ...tokens].join("; "));
        }
      }
      let request = new XMLHttpRequest();
      if (config.auth) {
        const username = config.auth.username || "";
        const password = config.auth.password ? unescape(encodeURIComponent(config.auth.password)) : "";
        requestHeaders.set("Authorization", "Basic " + btoa(username + ":" + password));
      }
      const fullPath = buildFullPath(config.baseURL, config.url);
      request.open(config.method.toUpperCase(), buildURL(fullPath, config.params, config.paramsSerializer), true);
      request.timeout = config.timeout;
      function onloadend() {
        if (!request) {
          return;
        }
        const responseHeaders = AxiosHeaders$1.from(
          "getAllResponseHeaders" in request && request.getAllResponseHeaders()
        );
        const responseData = !responseType || responseType === "text" || responseType === "json" ? request.responseText : request.response;
        const response2 = {
          data: responseData,
          status: request.status,
          statusText: request.statusText,
          headers: responseHeaders,
          config,
          request
        };
        settle(function _resolve(value) {
          resolve(value);
          done();
        }, function _reject(err) {
          reject(err);
          done();
        }, response2);
        request = null;
      }
      if ("onloadend" in request) {
        request.onloadend = onloadend;
      } else {
        request.onreadystatechange = function handleLoad() {
          if (!request || request.readyState !== 4) {
            return;
          }
          if (request.status === 0 && !(request.responseURL && request.responseURL.indexOf("file:") === 0)) {
            return;
          }
          setTimeout(onloadend);
        };
      }
      request.onabort = function handleAbort() {
        if (!request) {
          return;
        }
        reject(new AxiosError("Request aborted", AxiosError.ECONNABORTED, config, request));
        request = null;
      };
      request.onerror = function handleError() {
        reject(new AxiosError("Network Error", AxiosError.ERR_NETWORK, config, request));
        request = null;
      };
      request.ontimeout = function handleTimeout() {
        let timeoutErrorMessage = config.timeout ? "timeout of " + config.timeout + "ms exceeded" : "timeout exceeded";
        const transitional = config.transitional || transitionalDefaults;
        if (config.timeoutErrorMessage) {
          timeoutErrorMessage = config.timeoutErrorMessage;
        }
        reject(new AxiosError(
          timeoutErrorMessage,
          transitional.clarifyTimeoutError ? AxiosError.ETIMEDOUT : AxiosError.ECONNABORTED,
          config,
          request
        ));
        request = null;
      };
      if (platform.hasStandardBrowserEnv) {
        withXSRFToken && utils$1.isFunction(withXSRFToken) && (withXSRFToken = withXSRFToken(config));
        if (withXSRFToken || withXSRFToken !== false && isURLSameOrigin(fullPath)) {
          const xsrfValue = config.xsrfHeaderName && config.xsrfCookieName && cookies.read(config.xsrfCookieName);
          if (xsrfValue) {
            requestHeaders.set(config.xsrfHeaderName, xsrfValue);
          }
        }
      }
      requestData === void 0 && requestHeaders.setContentType(null);
      if ("setRequestHeader" in request) {
        utils$1.forEach(requestHeaders.toJSON(), function setRequestHeader(val, key) {
          request.setRequestHeader(key, val);
        });
      }
      if (!utils$1.isUndefined(config.withCredentials)) {
        request.withCredentials = !!config.withCredentials;
      }
      if (responseType && responseType !== "json") {
        request.responseType = config.responseType;
      }
      if (typeof config.onDownloadProgress === "function") {
        request.addEventListener("progress", progressEventReducer(config.onDownloadProgress, true));
      }
      if (typeof config.onUploadProgress === "function" && request.upload) {
        request.upload.addEventListener("progress", progressEventReducer(config.onUploadProgress));
      }
      if (config.cancelToken || config.signal) {
        onCanceled = (cancel) => {
          if (!request) {
            return;
          }
          reject(!cancel || cancel.type ? new CanceledError(null, config, request) : cancel);
          request.abort();
          request = null;
        };
        config.cancelToken && config.cancelToken.subscribe(onCanceled);
        if (config.signal) {
          config.signal.aborted ? onCanceled() : config.signal.addEventListener("abort", onCanceled);
        }
      }
      const protocol = parseProtocol(fullPath);
      if (protocol && platform.protocols.indexOf(protocol) === -1) {
        reject(new AxiosError("Unsupported protocol " + protocol + ":", AxiosError.ERR_BAD_REQUEST, config));
        return;
      }
      request.send(requestData || null);
    });
  };
  const knownAdapters = {
    http: httpAdapter,
    xhr: xhrAdapter
  };
  utils$1.forEach(knownAdapters, (fn, value) => {
    if (fn) {
      try {
        Object.defineProperty(fn, "name", { value });
      } catch (e) {
      }
      Object.defineProperty(fn, "adapterName", { value });
    }
  });
  const renderReason = (reason) => `- ${reason}`;
  const isResolvedHandle = (adapter) => utils$1.isFunction(adapter) || adapter === null || adapter === false;
  const adapters = {
    getAdapter: (adapters2) => {
      adapters2 = utils$1.isArray(adapters2) ? adapters2 : [adapters2];
      const { length } = adapters2;
      let nameOrAdapter;
      let adapter;
      const rejectedReasons = {};
      for (let i = 0; i < length; i++) {
        nameOrAdapter = adapters2[i];
        let id;
        adapter = nameOrAdapter;
        if (!isResolvedHandle(nameOrAdapter)) {
          adapter = knownAdapters[(id = String(nameOrAdapter)).toLowerCase()];
          if (adapter === void 0) {
            throw new AxiosError(`Unknown adapter '${id}'`);
          }
        }
        if (adapter) {
          break;
        }
        rejectedReasons[id || "#" + i] = adapter;
      }
      if (!adapter) {
        const reasons = Object.entries(rejectedReasons).map(
          ([id, state]) => `adapter ${id} ` + (state === false ? "is not supported by the environment" : "is not available in the build")
        );
        let s = length ? reasons.length > 1 ? "since :\n" + reasons.map(renderReason).join("\n") : " " + renderReason(reasons[0]) : "as no adapter specified";
        throw new AxiosError(
          `There is no suitable adapter to dispatch the request ` + s,
          "ERR_NOT_SUPPORT"
        );
      }
      return adapter;
    },
    adapters: knownAdapters
  };
  function throwIfCancellationRequested(config) {
    if (config.cancelToken) {
      config.cancelToken.throwIfRequested();
    }
    if (config.signal && config.signal.aborted) {
      throw new CanceledError(null, config);
    }
  }
  function dispatchRequest(config) {
    throwIfCancellationRequested(config);
    config.headers = AxiosHeaders$1.from(config.headers);
    config.data = transformData.call(
      config,
      config.transformRequest
    );
    if (["post", "put", "patch"].indexOf(config.method) !== -1) {
      config.headers.setContentType("application/x-www-form-urlencoded", false);
    }
    const adapter = adapters.getAdapter(config.adapter || defaults$1.adapter);
    return adapter(config).then(function onAdapterResolution(response2) {
      throwIfCancellationRequested(config);
      response2.data = transformData.call(
        config,
        config.transformResponse,
        response2
      );
      response2.headers = AxiosHeaders$1.from(response2.headers);
      return response2;
    }, function onAdapterRejection(reason) {
      if (!isCancel(reason)) {
        throwIfCancellationRequested(config);
        if (reason && reason.response) {
          reason.response.data = transformData.call(
            config,
            config.transformResponse,
            reason.response
          );
          reason.response.headers = AxiosHeaders$1.from(reason.response.headers);
        }
      }
      return Promise.reject(reason);
    });
  }
  const headersToObject = (thing) => thing instanceof AxiosHeaders$1 ? thing.toJSON() : thing;
  function mergeConfig(config1, config2) {
    config2 = config2 || {};
    const config = {};
    function getMergedValue(target, source, caseless) {
      if (utils$1.isPlainObject(target) && utils$1.isPlainObject(source)) {
        return utils$1.merge.call({ caseless }, target, source);
      } else if (utils$1.isPlainObject(source)) {
        return utils$1.merge({}, source);
      } else if (utils$1.isArray(source)) {
        return source.slice();
      }
      return source;
    }
    function mergeDeepProperties(a, b, caseless) {
      if (!utils$1.isUndefined(b)) {
        return getMergedValue(a, b, caseless);
      } else if (!utils$1.isUndefined(a)) {
        return getMergedValue(void 0, a, caseless);
      }
    }
    function valueFromConfig2(a, b) {
      if (!utils$1.isUndefined(b)) {
        return getMergedValue(void 0, b);
      }
    }
    function defaultToConfig2(a, b) {
      if (!utils$1.isUndefined(b)) {
        return getMergedValue(void 0, b);
      } else if (!utils$1.isUndefined(a)) {
        return getMergedValue(void 0, a);
      }
    }
    function mergeDirectKeys(a, b, prop) {
      if (prop in config2) {
        return getMergedValue(a, b);
      } else if (prop in config1) {
        return getMergedValue(void 0, a);
      }
    }
    const mergeMap = {
      url: valueFromConfig2,
      method: valueFromConfig2,
      data: valueFromConfig2,
      baseURL: defaultToConfig2,
      transformRequest: defaultToConfig2,
      transformResponse: defaultToConfig2,
      paramsSerializer: defaultToConfig2,
      timeout: defaultToConfig2,
      timeoutMessage: defaultToConfig2,
      withCredentials: defaultToConfig2,
      withXSRFToken: defaultToConfig2,
      adapter: defaultToConfig2,
      responseType: defaultToConfig2,
      xsrfCookieName: defaultToConfig2,
      xsrfHeaderName: defaultToConfig2,
      onUploadProgress: defaultToConfig2,
      onDownloadProgress: defaultToConfig2,
      decompress: defaultToConfig2,
      maxContentLength: defaultToConfig2,
      maxBodyLength: defaultToConfig2,
      beforeRedirect: defaultToConfig2,
      transport: defaultToConfig2,
      httpAgent: defaultToConfig2,
      httpsAgent: defaultToConfig2,
      cancelToken: defaultToConfig2,
      socketPath: defaultToConfig2,
      responseEncoding: defaultToConfig2,
      validateStatus: mergeDirectKeys,
      headers: (a, b) => mergeDeepProperties(headersToObject(a), headersToObject(b), true)
    };
    utils$1.forEach(Object.keys(Object.assign({}, config1, config2)), function computeConfigValue(prop) {
      const merge2 = mergeMap[prop] || mergeDeepProperties;
      const configValue = merge2(config1[prop], config2[prop], prop);
      utils$1.isUndefined(configValue) && merge2 !== mergeDirectKeys || (config[prop] = configValue);
    });
    return config;
  }
  const VERSION = "1.6.5";
  const validators$1 = {};
  ["object", "boolean", "number", "function", "string", "symbol"].forEach((type, i) => {
    validators$1[type] = function validator2(thing) {
      return typeof thing === type || "a" + (i < 1 ? "n " : " ") + type;
    };
  });
  const deprecatedWarnings = {};
  validators$1.transitional = function transitional(validator2, version, message) {
    function formatMessage(opt, desc) {
      return "[Axios v" + VERSION + "] Transitional option '" + opt + "'" + desc + (message ? ". " + message : "");
    }
    return (value, opt, opts) => {
      if (validator2 === false) {
        throw new AxiosError(
          formatMessage(opt, " has been removed" + (version ? " in " + version : "")),
          AxiosError.ERR_DEPRECATED
        );
      }
      if (version && !deprecatedWarnings[opt]) {
        deprecatedWarnings[opt] = true;
        console.warn(
          formatMessage(
            opt,
            " has been deprecated since v" + version + " and will be removed in the near future"
          )
        );
      }
      return validator2 ? validator2(value, opt, opts) : true;
    };
  };
  function assertOptions(options, schema, allowUnknown) {
    if (typeof options !== "object") {
      throw new AxiosError("options must be an object", AxiosError.ERR_BAD_OPTION_VALUE);
    }
    const keys = Object.keys(options);
    let i = keys.length;
    while (i-- > 0) {
      const opt = keys[i];
      const validator2 = schema[opt];
      if (validator2) {
        const value = options[opt];
        const result = value === void 0 || validator2(value, opt, options);
        if (result !== true) {
          throw new AxiosError("option " + opt + " must be " + result, AxiosError.ERR_BAD_OPTION_VALUE);
        }
        continue;
      }
      if (allowUnknown !== true) {
        throw new AxiosError("Unknown option " + opt, AxiosError.ERR_BAD_OPTION);
      }
    }
  }
  const validator = {
    assertOptions,
    validators: validators$1
  };
  const validators = validator.validators;
  class Axios {
    constructor(instanceConfig) {
      this.defaults = instanceConfig;
      this.interceptors = {
        request: new InterceptorManager$1(),
        response: new InterceptorManager$1()
      };
    }
    /**
     * Dispatch a request
     *
     * @param {String|Object} configOrUrl The config specific for this request (merged with this.defaults)
     * @param {?Object} config
     *
     * @returns {Promise} The Promise to be fulfilled
     */
    request(configOrUrl, config) {
      if (typeof configOrUrl === "string") {
        config = config || {};
        config.url = configOrUrl;
      } else {
        config = configOrUrl || {};
      }
      config = mergeConfig(this.defaults, config);
      const { transitional, paramsSerializer, headers } = config;
      if (transitional !== void 0) {
        validator.assertOptions(transitional, {
          silentJSONParsing: validators.transitional(validators.boolean),
          forcedJSONParsing: validators.transitional(validators.boolean),
          clarifyTimeoutError: validators.transitional(validators.boolean)
        }, false);
      }
      if (paramsSerializer != null) {
        if (utils$1.isFunction(paramsSerializer)) {
          config.paramsSerializer = {
            serialize: paramsSerializer
          };
        } else {
          validator.assertOptions(paramsSerializer, {
            encode: validators.function,
            serialize: validators.function
          }, true);
        }
      }
      config.method = (config.method || this.defaults.method || "get").toLowerCase();
      let contextHeaders = headers && utils$1.merge(
        headers.common,
        headers[config.method]
      );
      headers && utils$1.forEach(
        ["delete", "get", "head", "post", "put", "patch", "common"],
        (method) => {
          delete headers[method];
        }
      );
      config.headers = AxiosHeaders$1.concat(contextHeaders, headers);
      const requestInterceptorChain = [];
      let synchronousRequestInterceptors = true;
      this.interceptors.request.forEach(function unshiftRequestInterceptors(interceptor) {
        if (typeof interceptor.runWhen === "function" && interceptor.runWhen(config) === false) {
          return;
        }
        synchronousRequestInterceptors = synchronousRequestInterceptors && interceptor.synchronous;
        requestInterceptorChain.unshift(interceptor.fulfilled, interceptor.rejected);
      });
      const responseInterceptorChain = [];
      this.interceptors.response.forEach(function pushResponseInterceptors(interceptor) {
        responseInterceptorChain.push(interceptor.fulfilled, interceptor.rejected);
      });
      let promise2;
      let i = 0;
      let len;
      if (!synchronousRequestInterceptors) {
        const chain = [dispatchRequest.bind(this), void 0];
        chain.unshift.apply(chain, requestInterceptorChain);
        chain.push.apply(chain, responseInterceptorChain);
        len = chain.length;
        promise2 = Promise.resolve(config);
        while (i < len) {
          promise2 = promise2.then(chain[i++], chain[i++]);
        }
        return promise2;
      }
      len = requestInterceptorChain.length;
      let newConfig = config;
      i = 0;
      while (i < len) {
        const onFulfilled = requestInterceptorChain[i++];
        const onRejected = requestInterceptorChain[i++];
        try {
          newConfig = onFulfilled(newConfig);
        } catch (error2) {
          onRejected.call(this, error2);
          break;
        }
      }
      try {
        promise2 = dispatchRequest.call(this, newConfig);
      } catch (error2) {
        return Promise.reject(error2);
      }
      i = 0;
      len = responseInterceptorChain.length;
      while (i < len) {
        promise2 = promise2.then(responseInterceptorChain[i++], responseInterceptorChain[i++]);
      }
      return promise2;
    }
    getUri(config) {
      config = mergeConfig(this.defaults, config);
      const fullPath = buildFullPath(config.baseURL, config.url);
      return buildURL(fullPath, config.params, config.paramsSerializer);
    }
  }
  utils$1.forEach(["delete", "get", "head", "options"], function forEachMethodNoData(method) {
    Axios.prototype[method] = function(url2, config) {
      return this.request(mergeConfig(config || {}, {
        method,
        url: url2,
        data: (config || {}).data
      }));
    };
  });
  utils$1.forEach(["post", "put", "patch"], function forEachMethodWithData(method) {
    function generateHTTPMethod(isForm) {
      return function httpMethod(url2, data, config) {
        return this.request(mergeConfig(config || {}, {
          method,
          headers: isForm ? {
            "Content-Type": "multipart/form-data"
          } : {},
          url: url2,
          data
        }));
      };
    }
    Axios.prototype[method] = generateHTTPMethod();
    Axios.prototype[method + "Form"] = generateHTTPMethod(true);
  });
  const Axios$1 = Axios;
  class CancelToken {
    constructor(executor) {
      if (typeof executor !== "function") {
        throw new TypeError("executor must be a function.");
      }
      let resolvePromise;
      this.promise = new Promise(function promiseExecutor(resolve) {
        resolvePromise = resolve;
      });
      const token = this;
      this.promise.then((cancel) => {
        if (!token._listeners)
          return;
        let i = token._listeners.length;
        while (i-- > 0) {
          token._listeners[i](cancel);
        }
        token._listeners = null;
      });
      this.promise.then = (onfulfilled) => {
        let _resolve;
        const promise2 = new Promise((resolve) => {
          token.subscribe(resolve);
          _resolve = resolve;
        }).then(onfulfilled);
        promise2.cancel = function reject() {
          token.unsubscribe(_resolve);
        };
        return promise2;
      };
      executor(function cancel(message, config, request) {
        if (token.reason) {
          return;
        }
        token.reason = new CanceledError(message, config, request);
        resolvePromise(token.reason);
      });
    }
    /**
     * Throws a `CanceledError` if cancellation has been requested.
     */
    throwIfRequested() {
      if (this.reason) {
        throw this.reason;
      }
    }
    /**
     * Subscribe to the cancel signal
     */
    subscribe(listener) {
      if (this.reason) {
        listener(this.reason);
        return;
      }
      if (this._listeners) {
        this._listeners.push(listener);
      } else {
        this._listeners = [listener];
      }
    }
    /**
     * Unsubscribe from the cancel signal
     */
    unsubscribe(listener) {
      if (!this._listeners) {
        return;
      }
      const index2 = this._listeners.indexOf(listener);
      if (index2 !== -1) {
        this._listeners.splice(index2, 1);
      }
    }
    /**
     * Returns an object that contains a new `CancelToken` and a function that, when called,
     * cancels the `CancelToken`.
     */
    static source() {
      let cancel;
      const token = new CancelToken(function executor(c) {
        cancel = c;
      });
      return {
        token,
        cancel
      };
    }
  }
  const CancelToken$1 = CancelToken;
  function spread(callback) {
    return function wrap(arr) {
      return callback.apply(null, arr);
    };
  }
  function isAxiosError(payload) {
    return utils$1.isObject(payload) && payload.isAxiosError === true;
  }
  const HttpStatusCode = {
    Continue: 100,
    SwitchingProtocols: 101,
    Processing: 102,
    EarlyHints: 103,
    Ok: 200,
    Created: 201,
    Accepted: 202,
    NonAuthoritativeInformation: 203,
    NoContent: 204,
    ResetContent: 205,
    PartialContent: 206,
    MultiStatus: 207,
    AlreadyReported: 208,
    ImUsed: 226,
    MultipleChoices: 300,
    MovedPermanently: 301,
    Found: 302,
    SeeOther: 303,
    NotModified: 304,
    UseProxy: 305,
    Unused: 306,
    TemporaryRedirect: 307,
    PermanentRedirect: 308,
    BadRequest: 400,
    Unauthorized: 401,
    PaymentRequired: 402,
    Forbidden: 403,
    NotFound: 404,
    MethodNotAllowed: 405,
    NotAcceptable: 406,
    ProxyAuthenticationRequired: 407,
    RequestTimeout: 408,
    Conflict: 409,
    Gone: 410,
    LengthRequired: 411,
    PreconditionFailed: 412,
    PayloadTooLarge: 413,
    UriTooLong: 414,
    UnsupportedMediaType: 415,
    RangeNotSatisfiable: 416,
    ExpectationFailed: 417,
    ImATeapot: 418,
    MisdirectedRequest: 421,
    UnprocessableEntity: 422,
    Locked: 423,
    FailedDependency: 424,
    TooEarly: 425,
    UpgradeRequired: 426,
    PreconditionRequired: 428,
    TooManyRequests: 429,
    RequestHeaderFieldsTooLarge: 431,
    UnavailableForLegalReasons: 451,
    InternalServerError: 500,
    NotImplemented: 501,
    BadGateway: 502,
    ServiceUnavailable: 503,
    GatewayTimeout: 504,
    HttpVersionNotSupported: 505,
    VariantAlsoNegotiates: 506,
    InsufficientStorage: 507,
    LoopDetected: 508,
    NotExtended: 510,
    NetworkAuthenticationRequired: 511
  };
  Object.entries(HttpStatusCode).forEach(([key, value]) => {
    HttpStatusCode[value] = key;
  });
  const HttpStatusCode$1 = HttpStatusCode;
  function createInstance(defaultConfig) {
    const context = new Axios$1(defaultConfig);
    const instance = bind(Axios$1.prototype.request, context);
    utils$1.extend(instance, Axios$1.prototype, context, { allOwnKeys: true });
    utils$1.extend(instance, context, null, { allOwnKeys: true });
    instance.create = function create(instanceConfig) {
      return createInstance(mergeConfig(defaultConfig, instanceConfig));
    };
    return instance;
  }
  const axios = createInstance(defaults$1);
  axios.Axios = Axios$1;
  axios.CanceledError = CanceledError;
  axios.CancelToken = CancelToken$1;
  axios.isCancel = isCancel;
  axios.VERSION = VERSION;
  axios.toFormData = toFormData;
  axios.AxiosError = AxiosError;
  axios.Cancel = axios.CanceledError;
  axios.all = function all(promises) {
    return Promise.all(promises);
  };
  axios.spread = spread;
  axios.isAxiosError = isAxiosError;
  axios.mergeConfig = mergeConfig;
  axios.AxiosHeaders = AxiosHeaders$1;
  axios.formToJSON = (thing) => formDataToJSON(utils$1.isHTMLForm(thing) ? new FormData(thing) : thing);
  axios.getAdapter = adapters.getAdapter;
  axios.HttpStatusCode = HttpStatusCode$1;
  axios.default = axios;
  const axios$1 = axios;
  const url_all = {
    "DEV": "http://127.0.0.1:280",
    //本地开发
    "TEST": "http://www.liuchen.work:280"
    // 测试
  };
  const service = axios$1.create({
    // baseURL 将自动加在 url`前面，除非 url 是一个绝对 URL。
    baseURL: url_all["DEV"],
    // 调整当前环境
    // timeout设置一个请求超时时间，如果请求时间超过了timeout，请求将被中断，单位为毫秒（ms）
    timeout: 2500,
    // headers是被发送的自定义请求头，请求头内容需要根据后端要求去设置，这里我们使用本项目请求头。
    headers: {
      "Accept": "application/json",
      "Content-Type": "application/json"
    }
  });
  service.interceptors.request.use(
    (config) => {
      var token = store.state.token;
      if (token) {
        config.headers.token = token;
      }
      return config;
    },
    (err) => {
      return Promise.reject(err);
    }
  );
  service.interceptors.response.use(
    (response2) => {
      return response2;
    },
    (error2) => {
      return Promise.reject(error2);
    }
  );
  function createApp() {
    const app = vue.createVueApp(App);
    app.config.globalProperties.$service = service;
    app.use(store);
    return {
      app
    };
  }
  const { app: __app__, Vuex: __Vuex__, Pinia: __Pinia__ } = createApp();
  uni.Vuex = __Vuex__;
  uni.Pinia = __Pinia__;
  __app__.provide("__globalStyles", __uniConfig.styles);
  __app__._component.mpType = "app";
  __app__._component.render = () => {
  };
  __app__.mount("#app");
})(Vue, uni.VueShared);
