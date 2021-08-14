var CLOUD_ID_SUPPORT = !0,
  CLOUD_UPGADE_SUPPORT = !0,
  SET_SYS_PWD_LOADING = !0,
  REBOOT_SECONDS = 16e3,
  RESTORE_SECONDS = 17e3,
  RESET_SECONDS = 17e3,
  SYSUPGRADE_SECONDS = 22e3,
  MAX_WAN_RATE = 999999,
  SYS_LOGIN_PWD_LENGTH_MAX = 32,
  SYS_LOGIN_PWD_LENGTH_MIN = 6,
  WIRELESS_SSID_LENGTH_MAX = 32,
  WIRELESS_SSID_LENGTH_MIN = 1,
  WIRELESS_PWD_LENGTH_MAX = 63,
  WIRELESS_PWD_LENGTH_MIN = 8,
  MAX_WDS_SCAN_BAND = 64,
  SINGLE_BAND_ACCESS_DEVICE_NUM = 32,
  HOST_NAME_LEN_MIN = 0,
  HOST_NAME_LEN_MAX = 63,
  DEVICE_NAME_LEN_MIN = 0,
  DEVICE_NAME_LEN_MAX = 63,
  CLOUD_ACCOUNT_LENGTH_MAX = 64,
  CLOUD_ACCOUNT_LENGTH_MIN = 1,
  CLOUD_PWD_LENGTH_MAX = 32,
  CLOUD_PWD_LENGTH_MIN = 6,
  GUEST_NETWORK_ACCESS_TIME_RULE_MAX = 4,
  PARENT_DEVICE_NUM_MAX = 8,
  PARENT_CONTROL_RULE_NUM_MAX = 16,
  ACCESS_CONTROL_RULE_NUM_MAX = 16,
  ACCESS_CONTROL_RULE_DEVICE_NUM_MAX = 4,
  WLAN_SWITCH_RULE_MAX = 4,
  REBOOT_TIMER_RULE_MAX = 4,
  IP_MAC_BIND_RULE_MAX = 64,
  STATIC_ROUTE_RULE_MAX = 16,
  VIRTUAL_SERVER_RULE_MAX = 16,
  TECHNICAL_SUPPORT_NUMBER = "400-8810-500";

function SLP() {
  this.moduleSpec;
  this.bandsProvided = this.DOUBLE;
  this.bandSteeringProvided = !1;
  this.SINGLE = 1;
  this.DOUBLE = 2;
  this.TRIPLE = 3;
  this.wirelessConfig = { muMimoSupport: !1 };
  this.error = {};
  this.wds = {
    context: this,
    getData: function (a) {
      this.options = a;
      a = this.context;
      var b = this,
        c = uciWireless.dynData,
        d = {};
      d[uciWireless.fileName] = {};
      d[uciWireless.fileName][KEY_NAME] = [c.wds_2g];
      a.bandsProvided == a.TRIPLE
        ? d[uciWireless.fileName][KEY_NAME].push(c.wds_5g1, c.wds_5g2)
        : a.bandsProvided == a.DOUBLE &&
          d[uciWireless.fileName][KEY_NAME].push(c.wds_5g);
      $.query(
        d,
        function (a) {
          ENONE == a[ERR_CODE]
            ? b.options.success && b.options.success(a)
            : b.options.fail && b.options.fail(a);
        },
        void 0,
        !0
      );
    },
    setData: function (a, b) {},
  };
  this.host = {
    context: this,
    getData: function (a) {
      this.options = a;
      a = this.context;
      var b = this,
        c = {};
      c[uciWireless.fileName] = {};
      c[uciWireless.fileName][KEY_NAME] = [uciWireless.dynData.host_2g];
      a.bandsProvided == a.TRIPLE
        ? c[uciWireless.fileName][KEY_NAME].push(
            uciWireless.dynData.host_5g1,
            uciWireless.dynData.host_5g2
          )
        : a.bandsProvided == a.DOUBLE &&
          c[uciWireless.fileName][KEY_NAME].push(uciWireless.dynData.host_5g);
      this.context.bandSteeringProvided &&
        c[uciWireless.fileName][KEY_NAME].push(uciWireless.secName.wlanBS);
      $.query(
        c,
        function (a) {
          ENONE == a[ERR_CODE]
            ? b.options.success && b.options.success(a)
            : b.options.fail && b.options.fail(a);
        },
        void 0,
        !0
      );
    },
    setData: function (a) {
      this.options = a;
      this.timerSwtichOn = this.stateChanged = !1;
      this.state = 0;
      var b = this.options.data,
        c = this;
      c.name = void 0 != this.options.name ? name : void 0;
      Object.keys(b).forEach(function (a) {
        void 0 == c.name && (c.name = a);
        c.name == a &&
          ((a != uciWireless.secName.wlanBS &&
            null != b[a][uciWireless.dynOptName.enable]) ||
          (a == uciWireless.secName.wlanBS &&
            null != b[a][uciWireless.optName.wifiEnable])
            ? ((c.stateChanged = !0),
              (c.state =
                0 == b[a][uciWireless.dynOptName.enable] ||
                0 == b[a][uciWireless.optName.wifiEnable]
                  ? 0
                  : 1))
            : (c.stateChanged = !1));
      });
      this._checkWDS();
    },
    _checkWDS: function () {
      var a,
        b = this,
        c = this.name,
        d = this.options.data[c];
      switch (c) {
        case uciWireless.dynData.host_2g:
          a = uciWireless.dynData.wds_2g;
          break;
        case uciWireless.dynData.host_5g:
          a = uciWireless.dynData.wds_5g;
          break;
        case uciWireless.dynData.host_5g1:
          a = uciWireless.dynData.wds_5g1;
          break;
        case uciWireless.dynData.host_5g2:
          a = uciWireless.dynData.wds_5g2;
          break;
        default:
          a = "all";
      }
      b.context.wds.getData({
        success: function (c) {
          var f = !1;
          if ("all" == a)
            for (var g in c[uciWireless.fileName]) {
              if (
                1 == c[uciWireless.fileName][g][uciWireless.dynOptName.enable]
              ) {
                f = !0;
                break;
              }
            }
          else
            f = 1 == c[uciWireless.fileName][a][uciWireless.dynOptName.enable];
          f
            ? "all" == a ||
              (null == d[uciWireless.dynOptName.channel] &&
                null == d[uciWireless.dynOptName.mode] &&
                null == d[uciWireless.dynOptName.bandwidth])
              ? b.stateChanged && 0 == b.state
                ? confirmDialog.show({
                    title: label.confirmTitle,
                    content: label.wirelessSwitchTipForWDS,
                    callback: function (a) {
                      !0 == a
                        ? b._checkWlanTimer()
                        : b.options.fail && b.options.fail();
                    },
                  })
                : b._checkWlanTimer()
              : (alarmDialog.show({
                  content: errStr.wlanInvalidOptionWithWDSEnabled,
                }),
                b.options.resetPhyConfig && b.options.resetPhyConfig(),
                b.options.fail && b.options.fail(c))
            : b._checkWlanTimer();
        },
        fail: function () {
          b._checkWlanTimer();
        },
      });
    },
    _checkWlanTimer: function () {
      var a = {},
        b = this;
      a[uciTimeSwitch.fileName] = {};
      a[uciTimeSwitch.fileName][KEY_NAME] = [uciTimeSwitch.secName.general];
      b.stateChanged
        ? $.query(a, function (a) {
            a = a[uciTimeSwitch.fileName];
            null != a &&
            a[uciTimeSwitch.secName.general].enable ==
              uciTimeSwitch.optValue.enable.on
              ? ((b.timerSwtichOn = !0),
                confirmDialog.show({
                  title: label.confirmTitle,
                  content: label.timerSwitchTip,
                  callback: function (a) {
                    !0 == a
                      ? b._checkWPS()
                      : b.options.fail && b.options.fail();
                  },
                }))
              : ((b.timerSwtichOn = !1), b._checkWPS());
          })
        : b._checkWPS();
    },
    _checkWPS: function () {
      var a = {},
        b = this,
        c;
      switch (this.name) {
        case uciWireless.dynData.host_2g:
          c = "wps_status_2g";
          break;
        case uciWireless.dynData.host_5g:
          c = "wps_status_5g";
          break;
        case uciWireless.dynData.host_5g1:
          c = "wps_status_5g1";
          break;
        case uciWireless.dynData.host_5g2:
          c = "wps_status_5g4";
      }
      a[uciWireless.fileName] = {};
      a[uciWireless.fileName][KEY_NAME] = "wps_status";
      $.query(a, function (a) {
        var e = 0;
        ENONE == a[ERR_CODE]
          ? (e = a[uciWireless.fileName].wps_status[c])
          : EUNAUTH == a[ERR_CODE] && (e = 0);
        1 == e
          ? confirmDialog.show({
              title: label.confirmTitle,
              content: label.wpsConfigShowTip,
              callback: function (a) {
                a ? b._checkCurHost() : b.options.fail && b.options.fail();
              },
            })
          : b._checkCurHost();
      });
    },
    _checkCurHost: function () {
      var a = {},
        b = this,
        c = this.name,
        d = uciWireless.dynData;
      a[uciHostsInfo.fileName] = {};
      a[uciHostsInfo.fileName][KEY_TABLE] = [uciHostsInfo.dynData.online_host];
      b.stateChanged && 0 == b.state
        ? $.query(a, function (a) {
            a = formatTableData(
              a[uciHostsInfo.fileName][uciHostsInfo.dynData.online_host]
            );
            for (var f, g = 0, h = a.length; g < h; g++)
              if (((f = a[g]), 1 == f.is_cur_host)) {
                1 == f.type
                  ? c == uciWireless.secName.wlanBS ||
                    (c == d.host_2g && "0" == f.wifi_mode) ||
                    (c == d.host_5g && "1" == f.wifi_mode) ||
                    (c == d.host_5g1 && "2" == f.wifi_mode) ||
                    (c == d.host_5g2 && "3" == f.wifi_mode)
                    ? confirmDialog.show({
                        title: label.confirmTitle,
                        content: label.wirelessSwitchTip,
                        callback: function (a) {
                          !0 == a
                            ? b._send()
                            : b.options.fail && b.options.fail();
                        },
                      })
                    : b._send()
                  : b._send();
                break;
              }
          })
        : b._send();
    },
    _send: function () {
      var a = {},
        b = this;
      a[uciWireless.fileName] = this.options.data;
      b.timerSwtichOn &&
        ((a[uciTimeSwitch.fileName] = {}),
        (a[uciTimeSwitch.fileName][uciTimeSwitch.secName.general] = {}),
        (a[uciTimeSwitch.fileName][uciTimeSwitch.secName.general][
          uciTimeSwitch.optName.enable
        ] = uciTimeSwitch.optValue.enable.off));
      $.modify(a, function (a) {
        ENONE == a[ERR_CODE]
          ? b.options.success && b.options.success()
          : b.options.fail && b.options.fail(a);
      });
    },
  };
  this.protocol = {
    context: this,
    getData: function (a) {
      this.options = a;
      var b = {},
        c = uciProto.secName,
        d = this;
      b[uciProto.fileName] = {};
      b[uciProto.fileName][KEY_NAME] =
        a.type && "IPv6" == a.type
          ? [c.wanv6, c.dhcpv6, c.pppoev6, c.stav6]
          : [c.wan, c.dhcp, c.pppoe, c.sta];
      $.query(
        b,
        function (a) {
          ENONE == a[ERR_CODE] && d.options.success && d.options.success(a);
        },
        void 0,
        !0
      );
    },
    setData: function (a) {
      this.options = a;
      (a = a.data[uciProto.secName.wan]) &&
        null != a[uciProto.optName.type] &&
        (this.type = a[uciProto.optName.type]);
      this._checkWDS();
    },
    _checkWDS: function () {
      var a = this;
      this.context.wds.getData({
        success: function (b) {
          var c,
            d = !1,
            e;
          for (e in b[uciWireless.fileName])
            if (
              ((c = b[uciWireless.fileName][e]),
              1 == c[uciWireless.dynOptName.enable])
            ) {
              d = !0;
              break;
            }
          d
            ? (alarmDialog.show({ content: label.wanWDSTip }),
              a.options.fail && a.options.fail(b))
            : a._checkBridgeMode();
        },
        fail: function () {
          a._checkBridgeMode();
        },
      });
    },
    _checkBridgeMode: function () {
      var a = this,
        b = {};
      void 0 != this.context.moduleSpec.elink &&
      1 == this.context.moduleSpec.elink
        ? ((b[uciNetwork.fileName] = {}),
          (b[uciNetwork.fileName][KEY_NAME] = [
            uciNetwork.dynData.bridgestatus,
          ]),
          $.query(b, function (b) {
            ENONE == b[ERR_CODE]
              ? 1 == b.network.bridge_status.enable
                ? (alarmDialog.show({
                    content: "设备工作在桥模式，宽带拨号上网功能禁用。",
                  }),
                  a.options.fail && a.options.fail(b))
                : a._send()
              : a._send();
          }))
        : this._send();
    },
    _send: function () {
      var a = {},
        b = this;
      a[uciProto.fileName] = this.options.data;
      $.modify(a, function (a) {
        ENONE == a[ERR_CODE]
          ? b.options.success && b.options.success(a)
          : b.options.fail && b.options.fail(a);
      });
    },
  };
  this.guest = {
    context: this,
    getData: function (a) {
      this.options = a;
      a = {};
      var b = this;
      a[uciGuestNet.fileName] = {};
      a[uciGuestNet.fileName][KEY_NAME] = [uciGuestNet.secName.wireless2G];
      void 0 != this.context.moduleSpec.guest5g &&
        1 == this.context.moduleSpec.guest5g &&
        a[uciGuestNet.fileName][KEY_NAME].push(uciGuestNet.secName.wireless5G);
      $.query(
        a,
        function (a) {
          ENONE == a[ERR_CODE] && b.options.success && b.options.success(a);
        },
        void 0,
        !0
      );
    },
    setData: function (a) {
      this.options = a;
      this._send();
    },
    _send: function () {
      var a = {},
        b = this;
      a[uciGuestNet.fileName] = this.options.data;
      $.modify(a, function (a) {
        ENONE == a[ERR_CODE]
          ? b.options.success && b.options.success()
          : b.options.fail && b.options.fail(a);
      });
    },
  };
  this.timeStamp = null;
  this.expire = 1e3;
  this.wanStatus = {};
  this.latestWanStatus = function (a, b) {
    var c = this,
      d = new Date().getTime();
    (void 0 == b || !1 == b) &&
    null != this.timeStamp &&
    d - this.timeStamp < this.expire
      ? a && a(this.wanStatus)
      : ((d = {}),
        (d[uciNetwork.fileName] = {}),
        (d[uciNetwork.fileName][KEY_NAME] = uciNetwork.dynData.wanStatus),
        void 0 != this.moduleSpec.hnat &&
          1 == this.moduleSpec.hnat &&
          ((d[uciHNat.fileName] = {}),
          (d[uciHNat.fileName][KEY_NAME] = uciHNat.secName.main)),
        $.query(
          d,
          function (b) {
            ENONE == b[ERR_CODE] &&
              ((c.timeStamp = new Date().getTime()),
              (c.wanStatus =
                b[uciNetwork.fileName][uciNetwork.dynData.wanStatus]),
              b[uciHNat.fileName] &&
                1 ==
                  b[uciHNat.fileName][uciHNat.secName.main][
                    uciHNat.optName.enable
                  ] &&
                ((c.wanStatus[uciNetwork.optName.upSpeed] = null),
                (c.wanStatus[uciNetwork.optName.downSpeed] = null)));
            a && a(c.wanStatus);
          },
          void 0,
          !0
        ));
  };
  this.init = function (a) {
    var b = this,
      c = {};
    c[uciFunction.fileName] = {};
    c[uciFunction.fileName][KEY_NAME] = uciFunction.secName.newModuleSpec;
    $.query(
      c,
      function (c) {
        ENONE == c[ERR_CODE] &&
          ((b.moduleSpec =
            c[uciFunction.fileName][uciFunction.secName.newModuleSpec]),
          (b.bandSteeringProvided =
            1 == b.moduleSpec[uciFunction.optName.wlanBS]),
          (b.bandsProvided =
            null != b.moduleSpec[uciFunction.optName.channel5g1]
              ? b.TRIPLE
              : null != b.moduleSpec[uciFunction.optName.channel5g]
              ? b.DOUBLE
              : b.SINGLE),
          void 0 != b.moduleSpec.wireless5g_vhtmubfer &&
            1 == parseInt(b.moduleSpec.wireless5g_vhtmubfer) &&
            (b.wirelessConfig.muMimoSupport = !0));
        "function" == typeof a && a();
      },
      void 0,
      !0
    );
  };
}
var slp = new SLP();
(function () {
  Object.keys ||
    (Object.keys = (function () {
      var a = Object.prototype.hasOwnProperty,
        b = !{ toString: null }.propertyIsEnumerable("toString"),
        c =
          "toString toLocaleString valueOf hasOwnProperty isPrototypeOf propertyIsEnumerable constructor".split(
            " "
          ),
        d = c.length;
      return function (e) {
        if (("object" !== typeof e && "function" !== typeof e) || null === e)
          throw new TypeError("Object.keys called on non-object");
        var f = [],
          g;
        for (g in e) a.call(e, g) && f.push(g);
        if (b) for (g = 0; g < d; g++) a.call(e, c[g]) && f.push(c[g]);
        return f;
      };
    })());
  Array.prototype.map ||
    (Array.prototype.map = function (a) {
      var b, c, d;
      if (null == this) throw new TypeError("this is null or not defined");
      var e = Object(this),
        f = e.length >>> 0;
      if ("function" !== typeof a)
        throw new TypeError(a + " is not a function");
      1 < arguments.length && (b = arguments[1]);
      c = Array(f);
      for (d = 0; d < f; ) {
        var g;
        d in e && ((g = e[d]), (g = a.call(b, g, d, e)), (c[d] = g));
        d++;
      }
      return c;
    });
  Array.prototype.forEach ||
    (Array.prototype.forEach = function (a, b) {
      var c, d;
      if (null == this) throw new TypeError(" this is null or not defined");
      var e = Object(this),
        f = e.length >>> 0;
      if ("function" !== typeof a)
        throw new TypeError(a + " is not a function");
      1 < arguments.length && (c = b);
      for (d = 0; d < f; ) {
        var g;
        d in e && ((g = e[d]), a.call(c, g, d, e));
        d++;
      }
    });
  Array.prototype.filter ||
    (Array.prototype.filter = function (a) {
      if (void 0 === this || null === this) throw new TypeError();
      var b = Object(this),
        c = b.length >>> 0;
      if ("function" !== typeof a) throw new TypeError();
      for (
        var d = [], e = 2 <= arguments.length ? arguments[1] : void 0, f = 0;
        f < c;
        f++
      )
        if (f in b) {
          var g = b[f];
          a.call(e, g, f, b) && d.push(g);
        }
      return d;
    });
  Array.prototype.map ||
    (Array.prototype.map = function (a, b) {
      var c, d, e;
      if (null == this) throw new TypeError(" this is null or not defined");
      var f = Object(this),
        g = f.length >>> 0;
      if ("[object Function]" != Object.prototype.toString.call(a))
        throw new TypeError(a + " is not a function");
      b && (c = b);
      d = Array(g);
      for (e = 0; e < g; ) {
        var h;
        e in f && ((h = f[e]), (h = a.call(c, h, e, f)), (d[e] = h));
        e++;
      }
      return d;
    });
})();

(function () {
  function e(a) {
    c = $.authRltObj.time;
    switch (a) {
      case ESYSLOCKED:
      case ESYSLOCKEDFOREVER:
        window.top.location.reload();
        break;
      case EUNAUTH:
        a = void 0 == c ? d.cnt : c;
        if (d.cnt == a) break;
        a <= d.minTipCnt
          ? b.showNote(label.loginErrorTipH + a + label.loginErrorTipT)
          : b.showNote(label.loginPwdErr);
    }
  }
  function f() {
    var a = b.input.value;
    6 > a.length
      ? b.showNote(errStr.inputPwdLen)
      : $.auth($.orgAuthPwd(a), function (a) {
          a == ENONE
            ? (b.setValue(""), ($.authRltObj.bHandLg = !0), unloadLogin())
            : e(parseInt($.authRltObj.code));
        });
  }
  var d = {
      cnt: 10,
      minTipCnt: 3,
    },
    c,
    b = new Input({
      type: Input.TYPE.CIPHER_TEXT,
      label: { value: label.loginPwd, position: Input.LABEL.INNER },
      targetId: "passwordInput",
      check: {
        keyup: function (a) {
          a = a || window.event;
          if (13 == a.keyCode) return f();
        },
      },
      props: { maxlength: SYS_LOGIN_PWD_LENGTH_MAX, type: "password" },
    });
  new Button({
    text: btn.confirmTip,
    onClick: f,
    type: Button.TYPE.PRIMARY,
    id: "sub",
  });
  var g = new Dialog({
    title: label.loginPwdLost,
    size: Dialog.SIZE.MEDIUM,
    type: Dialog.TYPE.CUSTOM,
    content:
      '<span class="showGuideTitle">' +
      label.loginPwdLostTip +
      '</span><div class="showGuideStepCon"><i class="showGuideStepPic"></i><span class="showGuideStep first">' +
      label.loginPwdLostTipOne +
      '</span><span class="showGuideStep">' +
      label.loginPwdLostTipTwo +
      '</span><span class="showGuideStep last">' +
      label.loginPwdLostTipThree +
      "</span></div>",
    bottom: [
      {
        type: component.Button.TYPE.PRIMARY,
        text: btn.knowIt,
        id: "showGuideCancel",
        onClick: function () {
          g.hide();
        },
      },
    ],
  });
  id("showGuide").onclick = function () {
    g.show();
  };
  id("downloadAPP").onclick = function (a) {
    a = a || window.event;
    mercuryAppDialog.show(a);
  };
  window.setTimeout(function () {
    ieUnsupportCheck(function () {
      c = $.authRltObj.time;
      $.setTimeout(function () {
        e(parseInt($.authRltObj.code));
      }, 0);
    });
  });
})();

function Checks() {
  this.ipStr = "ip";
  this.maskStr = "mask";
  this.gatewayStr = "gateway";
  this.dnsStr = "dns";
  this.validIpAddr = function (a, b) {
    for (var c = a.split("."), d = 1, e = c.length; d < e; d++)
      if (255 < c[d]) return EINVIP;
    return 0 == c[0] || 224 < c[0]
      ? EINVNET
      : (void 0 != b && !0 == b.unCheckMutiIp) || 224 != c[0]
      ? (void 0 != b && !0 == b.unCheckLoopIp) || 127 != c[0]
        ? ENONE
        : EINVLOOPIP
      : EINVGROUPIP;
  };
  this.validIpFormat = function (a) {
    return !0 == /^([0-9]{1,3}\.){3}([0-9]{1,3})+$/g.test(a)
      ? ENONE
      : EINVIPFMT;
  };
  this.checkIp = function (a, b) {
    var c = ENONE;
    return 0 == a.length
      ? EINVIP
      : ENONE != (c = this.validIpFormat(a))
      ? c
      : (c = this.validIpAddr(a, b));
  };
  this.validMacAddr = function (a) {
    a = a.toLowerCase();
    return "00-00-00-00-00-00" == a
      ? EINVMACZERO
      : "ff-ff-ff-ff-ff-ff" == a
      ? EINVMACBROAD
      : 1 == "0123456789abcdef".indexOf(a.charAt(1)) % 2
      ? EINVMACGROUP
      : ENONE;
  };
  this.validMacFormat = function (a) {
    a.split("-");
    return !0 == /^([0-9a-f]{2}-){5}([0-9a-f]{2})+$/gi.test(a)
      ? ENONE
      : EINVMACFMT;
  };
  this.checkMac = function (a) {
    var b = ENONE;
    return ENONE != (b = this.validMacFormat(a))
      ? b
      : (b = this.validMacAddr(a));
  };
  this.checkMask = function (a) {
    var b = 1;
    if (ENONE != this.validIpFormat(a)) return EINVMASK;
    a = this.transIp(a);
    for (var c = 0; 32 > c; c++, b <<= 1)
      if (0 != (b & a)) {
        if (0 == (a ^ (4294967295 << c))) return ENONE;
        break;
      }
    return EINVMASK;
  };
  this.checkMtu = function (a, b, c) {
    if (!1 == this.checkNum(a)) return EINVMTU;
    void 0 == b && ((b = 1500), (c = 576));
    return !1 == this.checkNumRange(parseInt(a), b, c) ? EINVMTU : ENONE;
  };
  this.checkIpMask = function (a, b) {
    var c = this.transIp(b),
      d = this.transIp(a),
      c = this.checkIPNetHost(d, c);
    if (c != ENONE) return c;
    c = this.checkIpClass(a, b);
    return c != ENONE ? c : ENONE;
  };
  this.checkNetworkMask = function (a, b) {
    return a == this.getNetwork(a, b) ? ENONE : EINVIPMASKPAIR;
  };
  this.getNetwork = function (a, b) {
    for (
      var c = a.split("."), d = b.split("."), e = [], f = 0, g = c.length;
      f < g;
      f++
    )
      e.push(c[f] & d[f]);
    return e.join(".");
  };
  this.isSameNet = function (a, b, c) {
    a = this.getNetwork(a, b);
    b = this.getNetwork(c, b);
    return a == b;
  };
  this.transIp = function (a) {
    a = a.split(".");
    return 16777216 * a[0] + 65536 * a[1] + 256 * a[2] + 1 * a[3];
  };
  this.getCNStrLen = function (a) {
    return a.replace(/[^\x00-\xFF]/g, "xxx").length;
  };
  this.checkStrHasCN = function (a) {
    for (var b = a.length, c = 0; c < b; c++)
      if (127 < a.charCodeAt(c)) return !0;
    return !1;
  };
  this.getIpClass = function (a) {
    a = a.split(".");
    return 127 >= a[0]
      ? "A"
      : 191 >= a[0]
      ? "B"
      : 223 >= a[0]
      ? "C"
      : 239 >= a[0]
      ? "D"
      : "E";
  };
  this.checkNum = function (a) {
    return !/\D/g.test(a);
  };
  this.checkIPNetHost = function (a, b) {
    return 0 == (a & b) || b == (a & b)
      ? EINVNETID
      : 0 == (a & ~b) || ~b == (a & ~b)
      ? EINVHOSTID
      : ENONE;
  };
  this.checkIpClass = function (a, b) {
    var c = this.getIpClass(a),
      d = this.transIp(a),
      e = this.transIp(b);
    switch (c) {
      case "A":
        d &= 4278190080;
        break;
      case "B":
        d &= 4294901760;
        break;
      case "C":
        d &= 4294967040;
    }
    return e > d ? ENONE : EINVIPMASKPAIR;
  };
  this.checkInputName = function (a, b, c) {
    a = this.getCNStrLen(a);
    return c > a || b < a ? ESTRINGLEN : ENONE;
  };
  this.checkNumRange = function (a, b, c) {
    return isNaN(a) || a < c || a > b ? !1 : !0;
  };
  this.checkSsid = function (a) {
    if ("" == a) return EINVSSIDNULL;
    var b = this.getCNStrLen(a);
    return 1 > b || 32 < b
      ? EINVSSIDLEN
      : /^ +$/gi.test(a)
      ? EINVSSIDBLANK
      : ENONE;
  };
  this.checkWifiName = function (a, b, c) {
    return ENONE != this.checkInputName(a, b, c) ? !1 : !0;
  };
  this.checkDomain = function (a) {
    return !0 == /[^0-9a-z\-\.]/gi.test(a) ? EINDOMAIN : ENONE;
  };
  this.checkWlanPwd = function (a) {
    var b = getCNStrLen(a);
    if (0 == b) return EWLANPWDBLANK;
    a: {
      for (var c, d = 0, e = a.length; d < e; d++)
        if (
          ((c = a.charAt(d)),
          -1 ==
            "0123456789ABCDEFabcdefGHIJKLMNOPQRSTUVWXYZghijklmnopqrstuvwxyz`~!@#$^&*()-=_+[]{};:'\"\\|/?.,<>/% ".indexOf(
              c
            ))
        ) {
          a = !1;
          break a;
        }
      a = !0;
    }
    return !1 == a
      ? EINVWLANPWD
      : WIRELESS_PWD_LENGTH_MIN > b || WIRELESS_PWD_LENGTH_MAX < b
      ? EINVPSKLEN
      : ENONE;
  };
  this.checkPath = function (a) {
    return null == a || void 0 === a || 0 == a.length ? EINVPATHNULL : ENONE;
  };
  this.checkPhoneNum = function (a) {
    return /^\d{11}$/.test(a);
  };
  this.checkEmail = function (a) {
    if (!/^[\x21-\x7e]{1,64}@[\w\d\-]+\./.test(a)) return !1;
    a = a.split("@");
    if (2 < a.length) return !1;
    a = a[1];
    if (255 < a.length) return !1;
    a = a.split(".");
    for (var b in a) if (!/^[a-zA-Z\d\-]{1,64}$/.test(a[b])) return !1;
    return !0;
  };
  this.checkPorts = function (a) {
    a = a.split("-");
    if (2 == a.length) {
      a[0] != a[0] && (a[0] = "");
      a[1] != a[1] && (a[1] = "");
      if (0 == a[0].length || 0 == a[1].length) return EINVPORTFMT;
      if (0 != a[0].length && !1 == /\D/g.test(a[0])) a[0] = parseInt(a[0]);
      else if (0 != a[0].length) return EILLEGALPORT;
      if (0 != a[1].length && !1 == /\D/g.test(a[1])) a[1] = parseInt(a[1]);
      else if (0 != a[1].length) return EILLEGALPORT;
      if (0 > a[0] || 65535 < a[0] || 0 > a[1] || 65535 < a[1]) return EINVPORT;
    } else if (1 == a.length) {
      temp = a[0];
      temp != temp && (temp = "");
      if (0 != temp.length && !1 == /\D/g.test(temp)) temp = parseInt(temp);
      else if (0 != temp.length) return EILLEGALPORT;
      if (0 > temp || 65535 < temp) return EINVPORT;
    } else return EINVPORTFMT;
    return ENONE;
  };
  this.checkInputIp = function () {
    var a = checkIp(this.input.value);
    if (a != ENONE) {
      switch (a) {
        case EINVIP:
          this.showNote(errStr.inputIpAddrErr);
          break;
        case EINVIPFMT:
          this.showNote(errStr.inputFmtErr);
          break;
        case EINVNET:
          this.showNote(errStr.inputIpAddrNetErr);
          break;
        case EINVGROUPIP:
          this.showNote(errStr.inputIpAddrGroupErr);
          break;
        case EINVLOOPIP:
          this.showNote(errStr.inputIpAddrLoopErr);
          break;
        default:
          this.showNote(errStr.inputUnknown);
      }
      return !1;
    }
    return !0;
  };
  this.checkInputMac = function () {
    var a = checkMac(this.input.value);
    if (a != ENONE) {
      switch (a) {
        case EINVMACFMT:
          this.showNote(errStr.inputFmtErr);
          break;
        case EINVMACZERO:
          this.showNote(errStr.inputMacZeroErr);
          break;
        case EINVMACBROAD:
          this.showNote(errStr.inputMacBroadErr);
          break;
        case EINVMACGROUP:
          this.showNote(errStr.inputMacGroupErr);
          break;
        default:
          this.showNote(errStr.inputUnknown);
      }
      return !1;
    }
    return !0;
  };
  this.checkSysPwdKeyup = function () {
    var a = this.input.value;
    return "" == a
      ? !0
      : /\s+/.test(a)
      ? (this.showNote(errStr.inputPwdCharExistBlank), !1)
      : /^[\x21-\x7e]+$/.test(this.input.value)
      ? !0
      : (this.showNote(errStr.inputEliegalChar), !1);
  };
  this.checkSysPwdBlur = function () {
    var a = this.input.value;
    return 0 == a.length
      ? (this.showNote(errStr.inputPwd), !1)
      : a.length < SYS_LOGIN_PWD_LENGTH_MIN ||
        a.length > SYS_LOGIN_PWD_LENGTH_MAX
      ? (this.showNote(errStr.inputPwdLen), !1)
      : !0;
  };
  this.checkIpaddrOrDomain = function () {
    var a = this.input.value;
    if (0 == a.length) return this.showNote(errStr.inputIpOrDomainNull), !1;
    if (!0 == /[a-zA-Z]/g.test(a)) {
      if (ENONE != checkDomain(a))
        return this.showNote(errStr.inputDomainErr), !1;
    } else {
      if (ENONE != validIpFormat(a))
        return this.showNote(errStr.inputIpAddrFmtErr), !1;
      ENONE != validIpAddr(a) && this.showNote(errStr.inputIpAddrErr);
    }
    return !0;
  };
  this.checkSsidInput = function () {
    return "" == this.input.value
      ? (this.showNote(errStr.wlanSsidErr), !1)
      : /^ +$/gi.test(this.input.value)
      ? (this.showNote(errStr.wlanSsidBlank), !1)
      : checkWifiName(
          this.input.value,
          WIRELESS_SSID_LENGTH_MAX,
          WIRELESS_SSID_LENGTH_MIN
        )
      ? !0
      : (this.showNote(errStr.wlanSsidLenErr), !1);
  };
  this.onPwdBlur = function () {
    return EINVPSKLEN == checkWlanPwd(this.input.value)
      ? (this.showNote(errStr.wlanWzdPwdLenValid), !1)
      : !0;
  };
  this.onPwdKeyup = function () {
    return EINVWLANPWD == checkWlanPwd(this.input.value)
      ? (this.showNote(errStr.wlanWzdPwdValid), !1)
      : !0;
  };
  this.checkMtuInput = function () {
    var a = this.getValue();
    if (!checkNum(a)) return this.showNote(errStr.dhcpcMtuErr), !1;
    1500 < a
      ? this.setValue((1500).toString())
      : 576 > a && this.setValue((576).toString());
    return !0;
  };
}
(function () {
  Checks.call(window);
})();

function NiceScroll(a) {
  this.taId = a.targetId;
  this.hrzLine = a.hrzLine;
  this.ta = id(this.taId);
  if (1 != this.ta.nodeType) return null;
  this.st = el("label");
  this.sb = el("div");
  this.sbcW =
    this.stW =
    this.scW =
    this.sbW =
    this.sbcH =
    this.stH =
    this.scH =
    this.sbH =
      0;
  this.enabled = !0;
  this.mousePos = null;
  this.show = this.onSb = this.isScroll = !1;
  this.checkTt = null;
  this.isVertical = "undefined" != typeof a.vertical ? !0 === a.vertical : !0;
  this.wtId = null;
  this.woSpeed = this.wSpeed = this.wtCounter = 0;
  this.isVertical
    ? ((this.sbStyle = {
        position: "absolute",
        zIndex: a.zIndex || 1001,
        width: "8px",
        padding: "4px",
      }),
      (this.stStyle = {
        width: "8px",
        display: "inline-block",
        background: "#cacbcc",
        borderRadius: "4px",
        position: "relative",
        cursor: "pointer",
      }))
    : ((this.sbStyle = {
        position: "absolute",
        zIndex: a.zIndex || 1001,
        height: "8px",
        padding: "4px",
      }),
      (this.stStyle = {
        height: "8px",
        display: "inline-block",
        background: "#cacbcc",
        borderRadius: "4px",
        position: "relative",
        cursor: "pointer",
      }));
  this.hzStyle = {
    borderBottom: "1px solid #fff",
    borderImage:
      "-webkit-linear-gradient(to right, rgba(255,255,255,0) 0%, rgba(230,230,230,0.56) 31%, rgba(230,230,230,0.85) 71%, rgba(255,255,255,0) 99%) 0",
    borderImage:
      "-moz-linear-gradient(to right, rgba(255,255,255,0) 0%, rgba(230,230,230,0.56) 31%, rgba(230,230,230,0.85) 71%, rgba(255,255,255,0) 99%) 0",
    borderImage:
      "linear-gradient(to right, rgba(255,255,255,0) 0%, rgba(230,230,230,0.56) 31%, rgba(230,230,230,0.85) 71%, rgba(255,255,255,0) 99%) 0",
  };
  this.stOpacity = 0.1;
  "function" != typeof this.init &&
    ((NiceScroll.prototype.init = function () {
      var b = this;
      this.sb.id = this.taId + "niceScrollSb" + new Date().getTime();
      setStyle(this.sb, {
        backgroundColor: this.sbStyle.background || "transparent",
      });
      this.sb.appendChild(this.st);
      document.body.appendChild(this.sb);
      setStyle(this.sb, this.sbStyle);
      setStyle(this.st, this.stStyle);
      this._reset(!0);
      this.hrzLine && setStyle(this.ta, this.hzStyle);
      !1 == OS.portable
        ? setStyle(this.ta, { overflow: "hidden" })
        : setStyle(this.ta, { overflow: "scroll" });
      this._shSb();
      this._bind();
      window.setTimeout(function () {
        b.checkTt = window.setTimeout(arguments.callee, 10);
        b._check();
      }, 100);
    }),
    (NiceScroll.prototype.scrollBarSet = function (b) {
      if ("object" == typeof b) for (var a in b) this.sbStyle[a] = b[a];
    }),
    (NiceScroll.prototype.scrollTipSet = function (a) {
      if ("object" == typeof a) for (var c in a) this.stStyle[c] = a[c];
    }),
    (NiceScroll.prototype.scrollTipOpacity = function (a) {
      this.stOpacity = a;
    }),
    (NiceScroll.prototype.scrollTo = function (a) {
      a = parseInt(a);
      if (!0 == isNaN(a)) return !1;
      this.ta.scrollTop = a;
    }),
    (NiceScroll.prototype._reset = function (a) {
      a = $(this.ta).offset();
      var c = this.ta.offsetWidth,
        d = this.ta.offsetHeight,
        e = this.ta.scrollHeight,
        f = this.ta.scrollWidth,
        g = parseFloat(getNodeDefaultView(this.ta, "borderTopWidth")) || 0,
        h = parseFloat(getNodeDefaultView(this.ta, "borderBottomWidth")) || 0,
        k = parseFloat(getNodeDefaultView(this.ta, "borderRightWidth")) || 0,
        l = parseFloat(getNodeDefaultView(this.ta, "borderLeftWidth")) || 0;
      this.scH = e - d + g + h;
      this.stH = parseInt(0.7 * (d / e) * d);
      this.sbcH = d - (this.stH + 2);
      this.scW = f - c + l + k;
      this.stW = parseInt(0.7 * (c / f) * c);
      this.sbcW = c - (this.stW + 2);
      this.isVertical
        ? 0 >= e - d
          ? (setStyle(this.sb, { visibility: "hidden", top: "-9999px" }),
            (this.show = !1),
            this.hrzLine && (this.ta.style.borderImageSlice = "0"))
          : ((this.show = !0),
            setStyle(this.sb, { visibility: "visible" }),
            this.hrzLine &&
              0 == this.ta.scrollTop &&
              (this.ta.style.borderImageSlice = "1"),
            setStyle(this.sb, {
              top: a.top + g + "px",
              height: d - 8 + "px",
              left: a.left + c - k - parseInt(this.sb.offsetWidth) + "px",
            }),
            setStyle(this.st, {
              top: (this.ta.scrollTop / this.scH) * this.sbcH + "px",
              height: this.stH - 8 + "px",
            }))
        : 0 >= f - c
        ? (setStyle(this.sb, { visibility: "hidden", top: "-9999px" }),
          (this.show = !1))
        : ((this.show = !0),
          setStyle(this.sb, { visibility: "visible" }),
          setStyle(this.sb, {
            left: a.left + l + "px",
            width: c - 8 + "px",
            top: a.top + d - h - parseInt(this.sb.offsetHeight) + "px",
          }),
          setStyle(this.st, {
            left: (this.ta.scrollLeft / this.scW) * this.sbcW + "px",
            width: this.stW - 8 + "px",
          }));
    }),
    (NiceScroll.prototype._bind = function () {
      function a(b) {
        b = b || window.event;
        var c = b.touches[0].clientX,
          g = b.touches[0].clientY;
        if (d.isVertical) {
          var h = g - d.mousePos.y,
            k = parseFloat(d.st.style.top) - h;
          k >= d.sbcH
            ? ((k = d.sbcH), d.hrzLine && (d.ta.style.borderImageSlice = "0"))
            : ((k = 0 >= k ? 0 : k),
              d.hrzLine && (d.ta.style.borderImageSlice = "1"));
          d.st.style.top = k + "px";
        } else {
          var h = c - d.mousePos.x,
            l = parseFloat(d.st.style.left) - h,
            l = l >= d.sbcW ? d.sbcW : 0 >= l ? 0 : l;
          d.st.style.left = l + "px";
        }
        d.mousePos.x = c;
        d.mousePos.y = g;
        d.isScroll = !0;
        !1 == OS.portable &&
          (d.isVertical
            ? (d.ta.scrollTop = d.scH * (k / d.sbcH))
            : (d.ta.scrollLeft = d.scW * (l / d.sbcW)),
          eventPreventDefault(b));
        clearSelection(b);
      }
      function c(e) {
        detachEvnt(document, "touchmove", a);
        detachEvnt(document, "touchend", c);
        !1 == d.onSb && (d.isScroll = !1);
      }
      var d = this;
      document.attachEvent
        ? (this.isVertical &&
            this.ta.attachEvent("onmousewheel", function (a) {
              a = a || window.event;
              d._scroll(a);
            }),
          this.sb.attachEvent("onmousewheel", function (a) {
            a = a || window.event;
            d._scroll(a);
          }))
        : (this.isVertical &&
            this.ta.addEventListener(
              "mousewheel",
              function (a) {
                a = a || window.event;
                d._scroll(a);
              },
              !1
            ),
          this.isVertical &&
            this.ta.addEventListener(
              "DOMMouseScroll",
              function (a) {
                a = a || window.event;
                d._scroll(a);
              },
              !1
            ),
          this.sb.addEventListener(
            "mousewheel",
            function (a) {
              a = a || window.event;
              d._scroll(a);
            },
            !1
          ),
          this.sb.addEventListener(
            "DOMMouseScroll",
            function (a) {
              a = a || window.event;
              d._scroll(a);
            },
            !1
          ));
      attachEvnt(this.ta, "touchstart", function (e) {
        e = e || window.event;
        d.mousePos = { x: e.touches[0].clientX, y: e.touches[0].clientY };
        attachEvnt(document, "touchmove", a);
        attachEvnt(document, "touchend", c);
      });
      this.st.onmousedown = function (a) {
        d.mousePos = getMousePos(a);
        document.onmouseup = function (a) {
          document.onmousemove = null;
          document.onmouseup = null;
          !1 == d.onSb && (d.isScroll = !1);
        };
        document.onmousemove = function (a) {
          var b = getMousePos(a);
          if (d.isVertical) {
            var c = b.y - d.mousePos.y,
              c = parseFloat(d.st.style.top) + c;
            c >= d.sbcH
              ? ((c = d.sbcH), d.hrzLine && (d.ta.style.borderImageSlice = "0"))
              : ((c = 0 >= c ? 0 : c),
                d.hrzLine && (d.ta.style.borderImageSlice = "1"));
            d.st.style.top = c + "px";
            d.ta.scrollTop = d.scH * (c / d.sbcH);
          } else
            (c = b.x - d.mousePos.x),
              (c = parseFloat(d.st.style.left) + c),
              (c = c >= d.sbcW ? d.sbcW : 0 >= c ? 0 : c),
              (d.st.style.left = c + "px"),
              (d.ta.scrollLeft = d.scW * (c / d.sbcW));
          d.mousePos.x = b.x;
          d.mousePos.y = b.y;
          d.isScroll = !0;
          clearSelection(a);
        };
      };
      $("#" + this.sb.id)[0].onmouseover = function (a) {
        a = a || window.event;
        d.onSb = !0;
        !0 == d.show && d._scrollShow(a);
      };
      $("#" + this.sb.id)[0].onmouseout = function () {
        d.onSb = !1;
        d.isScroll = !1;
      };
    }),
    (NiceScroll.prototype._close = function () {
      this.sb.style.visibility = "hidden";
      this.enabled = !1;
    }),
    (NiceScroll.prototype._open = function () {
      this.enabled = !0;
    }),
    (NiceScroll.prototype._shSb = function () {
      this.sb.style.visibility =
        "none" == this.ta.style.display || "hidden" == this.ta.visibility
          ? "hidden"
          : "visible";
    }),
    (NiceScroll.prototype._check = function () {
      null == id(this.taId)
        ? (window.clearTimeout(this.checkTt),
          this.sb.parentNode.removeChild(this.sb))
        : !1 != this.enabled &&
          (!1 == checkInHorize(this.ta)
            ? (this.sb.style.display = "none")
            : ((this.sb.style.display = "block"),
              this.isVertical
                ? 0 >= parseInt(this.ta.offsetHeight) &&
                  (this.sb.style.visibility = "hidden")
                : 0 >= parseInt(this.ta.offsetWidth) &&
                  (this.sb.style.visibility = "hidden"),
              this._reset()));
    }),
    (NiceScroll.prototype._getWheelDelta = function (a) {
      a = a || window.event;
      return a.wheelDelta
        ? window.opera && 9.5 > window.opera.version
          ? -a.wheelDelta
          : a.wheelDelta
        : 40 * -a.detail;
    }),
    (NiceScroll.prototype._wheelAnimate = function (a, c) {
      var d = this,
        e = !1;
      this.wtId
        ? ((this.wtCounter = (e = 0 > (this.woSpeed ^ a))
            ? c
            : 50 > this.wtCounter + c
            ? this.wtCounter + c
            : 50),
          (this.wSpeed = e ? a : 1.05 * this.wSpeed))
        : ((this.wtCounter = c),
          (this.woSpeed = this.wSpeed = a),
          (function () {
            var a = 0;
            d.wtId = window.setTimeout(arguments.callee, 5);
            if (0 > d.wtCounter)
              clearTimeout(d.wtId),
                (d.wtId = null),
                !1 == d.onSb && (d.isScroll = !1);
            else {
              if (d.isVertical)
                (a = parseFloat(d.ta.scrollTop) + parseInt(d.wSpeed)),
                  a >= d.scH || 0 >= a
                    ? ((d.wtCounter = 0),
                      a >= d.scH &&
                        d.hrzLine &&
                        (d.ta.style.borderImageSlice = "0"))
                    : d.hrzLine && (d.ta.style.borderImageSlice = "1"),
                  (d.ta.scrollTop = a),
                  (a = (d.ta.scrollTop / d.scH) * d.sbcH),
                  isNaN(a) || (d.st.style.top = a + "px");
              else {
                a = parseFloat(d.ta.scrollLeft) + parseInt(d.wSpeed);
                if (a >= d.scW || 0 >= a) d.wtCounter = 0;
                d.ta.scrollLeft = a;
                a = (d.ta.scrollLeft / d.scW) * d.sbcW;
                isNaN(a) || (d.st.style.left = a + "px");
              }
              d.wtCounter--;
            }
          })());
    }),
    (NiceScroll.prototype._scrollShow = function (a) {
      $("#" + this.sb.id)
        .stop(!0)
        .css("visibility", "visible")
        .css("opacity", 1);
      this.isScroll = !0;
      eventPreventDefault(a);
    }),
    (NiceScroll.prototype._scroll = function (a) {
      a = a || window.event;
      var c = 0 < this._getWheelDelta(a) ? -1 : 1;
      !0 == this.show &&
        !0 == this.enabled &&
        (this._scrollShow(a), this._wheelAnimate(5 * c, 7));
    }));
}
function DateControl(a, b) {
  this.table;
  this.weekList;
  this.hourList;
  this.dateCon = id(a);
  this.weekIsMouseDown = !1;
  this.selDate = [0, 0, 0, 0, 0, 0, 0];
  this.dateArray = [0, 0, 0, 0, 0, 0, 0];
  this.cellWidth = this.cellHeight = 22;
  this.cellSeColor = "#A0D468";
  this.cellDeColor = "#FAFAFA";
  this.cellPadding = 1;
  void 0 == DateControl.prototype.init &&
    ((DateControl.prototype.hourStr = label.hour),
    (DateControl.prototype.weekDayNum = 7),
    (DateControl.prototype.lineStr = "-"),
    (DateControl.prototype.selTag = "selTag"),
    (DateControl.prototype.cellBorderWidth = 1),
    (DateControl.prototype.iCellIndex = 0),
    (DateControl.prototype.weekArray = [
      label.Mon,
      label.Tue,
      label.Wen,
      label.Thu,
      label.Fri,
      label.Sta,
      label.Sun,
    ]),
    (DateControl.prototype._init = function () {
      this._initOptions();
      this._dateConInit();
      this._hourListInit();
      this._weekListInit();
      this._dateTableInit();
    }),
    (DateControl.prototype.reset = function (a) {
      var b,
        e,
        f,
        g = this.iCellIndex;
      if (
        !1 != a instanceof Array &&
        void 0 != a &&
        a.length == this.weekDayNum
      )
        for (var h = 0; h < this.weekDayNum; h++) {
          e = this.table.rows[h];
          b = a[h];
          for (var k = 0; 24 > k; k++)
            (f = e.cells[k]),
              (f = f.childNodes[g]),
              void 0 != b
                ? (this._setSel(f, b % 2), (b >>= 1))
                : this._setSel(f, 0);
        }
    }),
    (DateControl.prototype._initOptions = function () {
      for (var a in b) "undefined" != typeof this[a] && (this[a] = b[a]);
    }),
    (DateControl.prototype.getSelDate = function () {
      var a,
        b,
        e = this.weekDayNum,
        f = this.table.rows;
      this.selDate = [0, 0, 0, 0, 0, 0, 0];
      for (var g = 0; g < e; g++) {
        b = f[g];
        for (var h = 0; 24 > h; h++)
          (a = b.cells[h]),
            (a = a.childNodes[0]),
            (a = parseInt(a.getAttribute("sel"))),
            1 == a && (this.selDate[g] += Math.pow(2, h));
      }
      return this.selDate;
    }),
    (DateControl.prototype._dateConInit = function () {
      this.dateCon.style.overflow = "hidden";
    }),
    (DateControl.prototype._hourListInit = function () {
      var a = document.createElement("ul"),
        b,
        e,
        f = this;
      a.className = "hourList";
      for (var g = 0; 24 >= g; g++)
        (b = document.createElement("li")),
          24 != g
            ? ((e = document.createElement("i")),
              (e.innerHTML = g),
              b.appendChild(e),
              (b.style.width =
                this.cellWidth +
                2 * this.cellPadding +
                this.cellBorderWidth +
                "px"),
              (e.onclick = (function (a) {
                return function () {
                  for (
                    var b = f.table.rows,
                      c = b.length,
                      d = f.iCellIndex,
                      e = 1,
                      g = 0;
                    g < c &&
                    ((e &= parseInt(
                      b[g].cells[a].childNodes[d].getAttribute("sel")
                    )),
                    0 != e);
                    g++
                  );
                  e = 1 - e;
                  for (g = 0; g < c; g++)
                    f._setSel(b[g].cells[a].childNodes[d], e);
                  clearSelection();
                };
              })(g)))
            : (b.innerHTML = "<i>" + this.hourStr + "</i>"),
          a.appendChild(b);
      this.dateCon.appendChild(a);
      this.hourList = a;
    }),
    (DateControl.prototype._weekListInit = function () {
      var a = document.createElement("ul"),
        b,
        e = this;
      a.className = "weekList";
      for (var f = 0, g = this.weekDayNum; f < g; f++)
        (b = document.createElement("li")),
          (b.style.height =
            this.cellHeight +
            2 * this.cellPadding +
            this.cellBorderWidth +
            "px"),
          (b.style.lineHeight =
            this.cellHeight +
            2 * this.cellPadding +
            this.cellBorderWidth +
            "px"),
          (b.innerHTML = this.weekArray[f]),
          (b.onclick = (function (a) {
            return function () {
              for (
                var b = e.table.rows[a].cells,
                  c = e.iCellIndex,
                  d = 1,
                  f = 0,
                  g = b.length;
                f < g &&
                ((d &= parseInt(b[f].childNodes[c].getAttribute("sel"))),
                0 != d);
                f++
              );
              d = 1 - d;
              f = 0;
              for (g = b.length; f < g; f++) e._setSel(b[f].childNodes[c], d);
              clearSelection();
            };
          })(f)),
          a.appendChild(b);
      this.dateCon.appendChild(a);
      this.weekList = a;
    }),
    (DateControl.prototype._setSel = function (a, b) {
      a.setAttribute("sel", b);
      a.style.backgroundColor = 1 == b ? this.cellSeColor : this.cellDeColor;
    }),
    (DateControl.prototype._dateCellCreate = function () {
      for (var a, b, e, f, g = this, h = 0, k = this.weekDayNum; h < k; h++) {
        b = this.table.insertRow(-1);
        void 0 != this.dateArray && (a = this.dateArray[h]);
        for (var l = 0; 24 > l; l++)
          (e = b.insertCell(-1)),
            (e.style.padding = this.cellPadding + "px"),
            (e.className = "weekTd"),
            (f = document.createElement("i")),
            (f.className = "tableICell"),
            (f.style.height = this.cellHeight + "px"),
            (f.style.width = this.cellWidth + "px"),
            e.appendChild(f),
            this._setSel(f, 0),
            void 0 != a
              ? (this._setSel(f, a % 2), (a >>= 1))
              : this._setSel(f, 0),
            (f.onmouseover = function (a) {
              !0 == g.weekIsMouseDown &&
                g._setSel(this, 1 - parseInt(this.getAttribute("sel")));
            }),
            (f.onmousedown = function (a) {
              g._setSel(this, 1 - parseInt(this.getAttribute("sel")));
            });
      }
      3 == this.table.rows[0].cells[0].nodeType && (this.iCellIndex = 1);
    }),
    (DateControl.prototype._dateCellBind = function () {
      var a = this;
      this.table.onmousedown = function (b) {
        a.weekIsMouseDown = !0;
        document.onmouseup = function (b) {
          a.weekIsMouseDown = !1;
        };
      };
      this.table.onmouseup = function (b) {
        a.weekIsMouseDown = !1;
      };
    }),
    (DateControl.prototype._dateTableCreate = function () {
      this.table = document.createElement("table");
      this.table.className = "tableWeek";
      this.table.cellspacing = "0px";
      this.table.cellpadding = "0px";
      this.dateCon.appendChild(this.table);
    }),
    (DateControl.prototype._dateTableInit = function () {
      this._dateTableCreate();
      this._dateCellCreate();
      this._dateCellBind();
    }));
  this._init();
}
function PageFunc() {
  this.pathStr = "../";
  this.htmlPathStr = this.pathStr + "pc/";
  this.detectPathStr = "/web-static/images/logo.png";
  this.imgDetectPathStr = "./web-static/images/logo.png";
  this.loginId = "Login";
  this.coverId = "Cover";
  this.conId = "Con";
  this.helpId = "Help";
  this.cloudPageId = "CloudAccountPage";
  this.loadPageData = { url: "", id: "" };
  this.isPostfunc;
  this.helpIdStr = "helpStr";
  this.LGKEYSTR = "lgKey";
  this.LGKEYTIMESTR = "lgKeyTime";
  this._gPageHeightLg = 0;
  this.LOCAL = "file:" == location.protocol;
  this.g_cur_host_mac = "00-00-00-00-00-00";
  this.gDomainDNS = "melogin.cn";
  this.gDomainDetectArr = null;
  this.showLoginHideNodesDelayHd;
  this.$Init = function () {
    Load.call(jQuery);
    $.getExplorer();
    $.initUrl();
  };
  this.refreshSession = function () {
    $.refreshSession(this.htmlPathStr + "Content.htm");
  };
  this.loadPageHandleBg = function () {
    for (var a = $("i.helpBtn"), b, c = 0, d = a.length; c < d; c++)
      (b = a[c]),
        (b = b.getAttribute(helpIdStr)),
        null != b && helpBind(a[c], b);
  };
  this.loadLgLessPage = function (a, b, c, d) {
    d = void 0 == d ? {} : d;
    d.htmlPathStr = this.pathStr + "loginLess/";
    this.loadPage(a, b, c, d);
  };
  this.loadDialogRenderPage = function (a, b, c) {
    this.loadPage(a, b, c, void 0, {
      isDialogRender: !0,
      isNoClearTimeout: !0,
    });
  };
  this.loadPage = function (a, b, c, d, e) {
    var f = this;
    window.setTimeout(function () {
      var g = f.htmlPathStr;
      helpClose();
      d = void 0 == d ? {} : d;
      g = void 0 == d.htmlPathStr ? g : d.htmlPathStr;
      !1 !== d.bRecordLoadPage && setLoadPage(a, b);
      $.load(
        g + a,
        function (a) {
          try {
            "function" == typeof pageOnloadMenuCallback &&
              pageOnloadMenuCallback();
          } catch (b) {}
          "function" == typeof c && c(a);
        },
        b,
        e
      );
    }, 0);
  };
  this.unloadDetail = function (a) {
    if ((a = id(a))) a.innerHTML = "";
  };
  this.detailShow = function (a, b) {
    $("#" + a).fadeIn(800, b);
  };
  this.detailHide = function (a, b) {
    $("#" + a).fadeOut(800, function () {
      $("#" + a).css("display", "none");
      window.unloadDetail(b);
    });
  };
  this.selectChange = function (a, b) {
    id(a).value = b.options[b.selectedIndex].text;
  };
  this.showCon = function (a) {
    var b = id(a),
      c,
      d = document.body.childNodes,
      e;
    for (e in d)
      (c = d[e]),
        void 0 != c.nodeName &&
          "DIV" == c.nodeName.toUpperCase() &&
          c.id != a &&
          setStyle(c, { display: "none" });
    setStyle(b, { display: "block" });
  };
  this.loginChange = function (a) {
    function b() {
      for (var a in g)
        (f = g[a]),
          void 0 != f.nodeName &&
            "DIV" == f.nodeName.toUpperCase() &&
            f.id != h.loginId &&
            f.id != h.conId &&
            f.id != h.helpId &&
            h.setStyle(f, { display: "none" });
      h.setStyle(id(conId), { display: d });
      h.setStyle(id(helpId), { display: d });
      h.setStyle(c, { display: e });
      "function" == typeof isPostfunc && isPostfunc();
    }
    var c = this.id(this.loginId),
      d = "block",
      e = "none",
      f,
      g = document.body.childNodes,
      h = this;
    !0 == a && ((d = "none"), (e = "block"));
    emptyNodes(c);
    if (!0 == a) {
      a = "LoginChgPwd.htm";
      var k = "Login.htm",
        l = "Content.htm";
      1 == phoneTip &&
        ((a = "PhoneLoginChgPwd.htm"),
        (k = "PhoneLogin.htm"),
        (l = "PhoneContent.htm"));
      ESYSRESET == $.authRltObj.code
        ? (0 == phoneTip && !0 == OS.portable && !1 == OS.iPad
            ? this.loadLgLessPage("PhoneSetPwdWeb.htm", "Con", void 0, {
                bRecordLoadPage: !1,
              })
            : this.loadPage(a, "Login", b, { bRecordLoadPage: !1 }),
          emptyNodes(id("Con")),
          this.setLoadPage(l, "Con"))
        : (0 == phoneTip && ESYSLOCKEDFOREVER == $.authRltObj.code) ||
          ESYSLOCKED == $.authRltObj.code
        ? $.queryAuthLog(function (a) {
            $.authRltObj.authLog = a.unauth_log_list;
            $.authRltObj.client = a.curIP;
            b();
            this.loadLgLessPage("LoginAuthLog.htm", "Login", void 0, {
              bRecordLoadPage: !1,
            });
          })
        : 0 == phoneTip &&
          !0 == OS.portable &&
          !1 == OS.iPad &&
          !1 == phoneSet.bContinuePCSet
        ? this.loadLgLessPage("PhoneAppWeb.htm", "Con", void 0, {
            bRecordLoadPage: !1,
          })
        : this.loadPage(k, "Login", b, { bRecordLoadPage: !1 });
    } else this.loadPage(this.loadPageData.url, this.loadPageData.id, b);
  };
  this.setLoadPage = function (a, b) {
    this.loadPageData.url = a;
    this.loadPageData.id = b;
  };
  this.localSgInit = function () {
    try {
      this.sessionLS.init(),
        !0 == isIE &&
          !1 == isIENormal &&
          (function () {
            sessionLS.setExpire(3e3);
            window.setTimeout(arguments.callee, 1e3);
          })();
    } catch (a) {}
    this.getLgPwd();
  };
  this.auth = function () {
    $.auth($.pwd);
  };
  this.getLgPwd = function () {
    try {
      ($.pwd = sessionLS.getItem(this.LGKEYSTR)),
        0 == gCloudAccountBR.pwdLen &&
          (gCloudAccountBR.pwdLen = parseInt(sessionLS.getItem(this.LGKEYLEN)));
    } catch (a) {}
  };
  this.showLogin = function (a) {
    this.isPostfunc = a;
    this.loginChange(!0);
  };
  this.unloadLogin = function () {
    this.loginChange(!1);
  };
  this.ifrmOrgUrl = function (a) {
    return "/stok=" + encodeURIComponent($.session) + "?code=" + a;
  };
  this.iFrmOnload = function (a, b, c) {
    var d;
    c = ENONE;
    a = id(a);
    var e, f;
    try {
      d = a.contentWindow
        ? a.contentWindow.document.body
          ? a.contentWindow.document.body.innerHTML
          : null
        : a.contentDocument.document.body
        ? a.contentDocument.document.body.innerHTML
        : null;
      if (/(<pre>)?(.+)(<\/pre>)+/.test(d) || /(<pre>)?(.+)/.test(d))
        e = RegExp.$2;
      f = JSON.parse(e);
      c = f[ERR_CODE];
      b(c, f);
    } catch (g) {
      b(EINVFMT);
    }
  };
  this.windowSleep = function (a) {
    var b = new Date();
    for (a = b.getTime() + a; !((b = new Date()), b.getTime() > a); );
  };
  this.logSave = function () {
    var a = {};
    a[uciSystem.fileName] = {};
    a[uciSystem.fileName][uciSystem.actionName.downloadLogs] = null;
    $.action(
      a,
      function (a) {
        a = $.orgURL(a.url);
        location.href = a;
      },
      !0,
      !0
    );
  };
  this.pageRedirect = function () {
    var a = window.top.location.href,
      b =
        /^((http:\/\/)*\[\s*((([0-9A-Fa-f]{1,4}:){7}([0-9A-Fa-f]{1,4}|:))|(([0-9A-Fa-f]{1,4}:){6}(:[0-9A-Fa-f]{1,4}|((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){5}(((:[0-9A-Fa-f]{1,4}){1,2})|:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){4}(((:[0-9A-Fa-f]{1,4}){1,3})|((:[0-9A-Fa-f]{1,4})?:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){3}(((:[0-9A-Fa-f]{1,4}){1,4})|((:[0-9A-Fa-f]{1,4}){0,2}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){2}(((:[0-9A-Fa-f]{1,4}){1,5})|((:[0-9A-Fa-f]{1,4}){0,3}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){1}(((:[0-9A-Fa-f]{1,4}){1,6})|((:[0-9A-Fa-f]{1,4}){0,4}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(:(((:[0-9A-Fa-f]{1,4}){1,7})|((:[0-9A-Fa-f]{1,4}){0,5}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:)))(%.+)?\s*\])/g;
    USER_GROUP_REMOTE != $.authRltObj.group &&
      !1 == /^((http:\/\/)*(\d{1,3}\.){3}\d{1,3})/g.test(a) &&
      !1 == b.test(a) &&
      0 > a.indexOf(gDomainDNS) &&
      !1 == $.local &&
      (window.top.location.href = $.httpTag + gDomainDNS);
  };
  this.pageOnload = function () {
    var a = [
        { tag: "link", url: "../web-static/dynaform/menu.css" },
        { tag: "link", url: "../web-static/dynaform/components.css" },
        { tag: "link", url: "../web-static/fonts/iconfont.css" },
      ],
      b = [
        { tag: "script", url: "../web-static/dynaform/menu.js" },
        { tag: "script", url: "../web-static/dynaform/componentsObj.js" },
        { tag: "script", url: "../web-static/dynaform/optionsSet.js" },
      ],
      c = [
        { tag: "script", url: "../web-static/lib/slp-ajax.js" },
        { tag: "script", url: "../web-static/lib/ajax.js" },
        { tag: "script", url: "../web-static/dynaform/uci.js" },
        { tag: "script", url: "../web-static/language/cn/str.js" },
        { tag: "script", url: "../web-static/language/cn/error.js" },
        { tag: "script", url: "../web-static/lib/verify.js" },
        { tag: "script", url: "../web-static/dynaform/macFactory.js" },
        { tag: "script", url: "../web-static/dynaform/components.js" },
      ];
    "undefined" == typeof supportApp && (supportApp = !1);
    this.loadExternResource({
      scripts: [
        { tag: "script", url: "../web-static/dynaform/settings.js" },
        { tag: "script", url: "../web-static/dynaform/api.js" },
        { tag: "script", url: "../web-static/lib/jquery-1.10.1.min.js" },
        { tag: "script", url: "../web-static/lib/json.js" },
      ],
      callBack: function () {
        this.loadExternResource({
          scripts: c,
          callBack: function () {
            this.loadExternResource({
              scripts: b,
              links: a,
              callBack: function () {
                var a = window.top.location.href;
                $Init();
                $.setexternJSP(replaceJSP);
                $.setExternPageHandle(loadPageHandleBg);
                $.setLoginErrHandle(showLogin);
                $.setPRHandle(pageRedirect);
                this.localSgInit();
                titleStr.hardwareinfo = document.title;
                "undefined" == typeof phoneTip
                  ? ((phoneTip = 0),
                    !1 == /^((http:\/\/)*(\d{1,3}\.){3}\d{1,3})/g.test(a) &&
                    0 <= a.indexOf(gDomainDNS) &&
                    "NO" == gBeInCNA
                      ? $.action({ get_domain_array: null }, function (a) {
                          ENONE == a[ERR_CODE]
                            ? ((a = a.domain_array),
                              1 < a.length
                                ? ((this.gDomainDetectArr = a),
                                  this.loadLgLessPage(
                                    "RouterSelect.htm",
                                    "Con",
                                    void 0,
                                    { bRecordLoadPage: !1 }
                                  ))
                                : this.loadPage("Content.htm", "Con"))
                            : this.loadPage("Content.htm", "Con");
                        })
                      : this.loadPage("Content.htm", "Con"))
                  : ((this.htmlPathStr = this.pathStr + "common/"),
                    this.loadPage("PhoneContent.htm", "Con"));
              },
            });
          },
        });
      },
    });
    document.oncontextmenu = function (a) {
      return !1;
    };
    if (isIESix)
      try {
        document.execCommand("BackgroundImageCache", !1, !0);
      } catch (d) {}
  };
  this.loadExternResource = function (a) {
    var b,
      c,
      d,
      e,
      f = document.getElementsByTagName("head")[0];
    b = { links: null, scripts: null, callBack: null };
    for (var g in a) b[g] = a[g];
    a = b.links;
    c = b.scripts;
    d = b.callBack;
    if (void 0 != a)
      for (var h in a)
        (b = document.createElement("link")),
          (b.rel = "stylesheet"),
          (b.href = a[h].url),
          f.appendChild(b);
    if (void 0 != c) {
      var k;
      b = document.createElement("script");
      b.type = "text/javascript";
      if (void 0 != d)
        for (h in ((e = void 0 != b.readyState),
        (k = function (a) {
          c[a].loadState = !0;
          for (var b in c) if (!1 == c[b].loadState) return;
          d();
        }),
        c))
          c[h].loadState = !1;
      for (h in c)
        (b = document.createElement("script")),
          (b.type = "text/javascript"),
          void 0 != d &&
            (e
              ? (b.onreadystatechange = (function (a) {
                  return function () {
                    if (
                      "loaded" == this.readyState ||
                      "complete" == this.readyState
                    )
                      (this.onreadystatechange = null), k(a);
                  };
                })(h))
              : (b.onload = (function (a) {
                  return function () {
                    k(a);
                  };
                })(h))),
          (b.src = c[h].url),
          f.appendChild(b);
    }
  };
}
function Cover() {
  Style.call(this);
  this.CoverId = "Cover";
  this.getActualSize = function () {
    var a = $(document).height(),
      b = $(document).width(),
      c = $(window).height(),
      d = $(window).width();
    return {
      documentWidth: b,
      documentHeight: a,
      windowWidth: d,
      windowHeight: c,
    };
  };
  this.hideCover = function (a, b) {
    var c = id(this.CoverId);
    this.setStyle(c, { display: "none", visibility: "hidden" });
    this.setStyle(c, b);
    "undefined" != typeof a && a(c);
    c.innerHTML = "";
  };
  this.showCover = function (a, b) {
    var c = id(this.CoverId);
    this.setStyle(c, { display: "block", visibility: "visible" });
    this.setStyle(c, b);
    "undefined" != typeof a && a(c);
  };
  this.showMask = function (a, b) {
    if ("block" != $("#Mask").css("display")) {
      var c = getActualSize();
      $("#Mask")
        .css("opacity", "0")
        .css("width", c.documentWidth)
        .css("height", c.documentHeight);
      $("#Mask").fadeTo(250, 0.2, a);
    }
  };
  this.enableScroll = function (a) {};
  this.hideMask = function (a, b) {
    "none" != $("#Mask").css("display") &&
      $("#Mask").fadeOut(250, function () {
        "function" == typeof a && a();
      });
  };
}
function Style() {
  this.disableCol = "#b2b2b2";
  this.setStyle = function (a, b) {
    if (null != a && null != b && 1 == a.nodeType)
      for (var c in b)
        try {
          a.style[c] = b[c];
        } catch (d) {}
  };
  this.getNodeDefaultView = function (a, b) {
    var c = null;
    if (!a) return null;
    try {
      return (
        (c = a.currentStyle
          ? a.currentStyle
          : document.defaultView.getComputedStyle(a, null)),
        void 0 != b ? c[b] : c
      );
    } catch (d) {}
  };
}
function LocalStorageSD() {
  try {
    this.sessionLS =
      null == this.sessionStorage
        ? {
            file_name: "user_data_default_SD",
            dom: null,
            init: function () {
              var a = document.createElement("input");
              a.type = "hidden";
              a.addBehavior("#default#userData");
              document.body.appendChild(a);
              a.save(this.file_name);
              this.dom = a;
            },
            setItem: function (a, c) {
              this.dom.setAttribute(a, c);
              this.dom.save(this.file_name);
            },
            getItem: function (a, c) {
              this.dom.load(this.file_name);
              return this.dom.getAttribute(a);
            },
            removeItem: function (a) {
              this.dom.removeAttribute(a);
              this.dom.save(this.file_name);
            },
            setExpire: function (a) {
              var c = new Date(),
                c = new Date(c.getTime() + a);
              this.dom.load(this.file_name);
              this.dom.expires = c.toUTCString();
              this.dom.save(this.file_name);
            },
          }
        : sessionStorage;
  } catch (a) {}
}
function Explorer() {
  this.isIETenLess =
    this.isIENormal =
    this.isIEEight =
    this.isIESeven =
    this.isIESix =
    this.isIEEleven =
    this.isEdge =
    this.isIE =
      !1;
  this.explorerInfo = navigator.userAgent;
  this.getIEInfo = function () {
    isIE =
      -1 < explorerInfo.indexOf("compatible") &&
      -1 < explorerInfo.indexOf("MSIE");
    isEdge = -1 < explorerInfo.indexOf("Edge") && !isIE;
    isIEEleven =
      -1 < explorerInfo.indexOf("Trident") &&
      -1 < explorerInfo.indexOf("rv:11.0");
    !1 != isIE &&
      ((isIE = /msie ((\d+\.)+\d+)/i.test(explorerInfo)
        ? document.mode || RegExp.$1
        : !1),
      6 >= isIE
        ? (this.isIESix = !0)
        : 7 == isIE
        ? (this.isIESeven = !0)
        : 8 == isIE
        ? (this.isIEEight = !0)
        : 9 <= isIE && (this.isIENormal = !0),
      10 >= isIE && (this.isIETenLess = !0),
      (this.isIE = !0));
  };
  this.ieUnsupportCheck = function (a) {
    0 <= document.cookie.indexOf("ieSixClosed")
      ? "function" == typeof a && a()
      : isIE && !isIENormal
      ? alarmDialog.show({
          content: label.IENineLessUnsupportTip,
          callback: function () {
            document.cookie = "ieSixClosed=true";
            "function" == typeof a && a();
          },
        })
      : "function" == typeof a && a();
  };
  this.compatibleShow = function () {};
  this.createGroupRadio = function (a) {
    var b;
    if (void 0 == a) return b;
    !0 == this.isIE && !1 == this.isIENormal
      ? (b = document.createElement("<input name='" + a + "' />"))
      : ((b = document.createElement("input")), (b.name = a));
    return b;
  };
  this.getIEInfo();
}
function Tool() {
  Style.call(this);
  this.id = function (a) {
    if (void 0 != a) return document.getElementById(a);
  };
  this.el = function (a) {
    try {
      return document.createElement(a);
    } catch (b) {
      return null;
    }
  };
  this.replaceJSP = function (a) {
    var b = null,
      c,
      d = /{%(\w+)\.(\w+)%}/i,
      b = d.exec(a);
    try {
      for (; null != b; )
        (c = language[b[1]][b[2]]),
          (a = a.replace("{%" + b[1] + "." + b[2] + "%}", c)),
          (b = d.exec(a));
    } catch (e) {}
    return a;
  };
  this.getoffset = function (a, b) {
    for (var c = a, d = { top: 0, left: 0 }; c != b; )
      (d.left += parseInt(c.offsetLeft)),
        (d.top += parseInt(c.offsetTop)),
        (c = c.offsetParent);
    return d;
  };
  this.attachEvnt = function (a, b, c) {
    0 == b.indexOf("on") && (b = b.substring(2));
    document.body.attachEvent
      ? a.attachEvent("on" + b, c)
      : a.addEventListener(b, c, !1);
  };
  this.detachEvnt = function (a, b, c) {
    0 == b.indexOf("on") && (b = b.substring(2));
    document.body.attachEvent
      ? a.detachEvent("on" + b, c)
      : a.removeEventListener(b, c, !1);
  };
  this.stopProp = function (a) {
    a = a || window.event;
    a.stopPropagation ? a.stopPropagation() : (a.cancelBubble = !0);
  };
  this.eventPreventDefault = function (a) {
    a = a || window.event;
    a.preventDefault ? a.preventDefault() : (a.returnValue = !1);
  };
  this.clearSelection = function () {
    window.getSelection
      ? window.getSelection().removeAllRanges()
      : document.selection.empty();
  };
  this.setDomCursorPos = function (a, b) {
    if (a.setSelectionRange) a.focus(), a.setSelectionRange(b, b);
    else if (a.createTextRange) {
      var c = a.createTextRange();
      c.collapse(!0);
      c.moveEnd("character", b);
      c.moveStart("character", b);
      c.select();
    }
  };
  this.getMousePos = function (a) {
    a = a || window.event;
    var b = document;
    return a.pageX || a.pageY
      ? { x: a.pageX, y: a.pageY }
      : {
          x:
            a.clientX +
            b.documentElement.scrollLeft -
            b.documentElement.clientLeft,
          y:
            a.clientY +
            b.documentElement.scrollTop -
            b.documentElement.clientTop,
        };
  };
  this.isArray = function (a) {
    return "[object Array]" === Object.prototype.toString.call(a);
  };
  this.isObject = function (a) {
    return "[object Object]" === Object.prototype.toString.call(a);
  };
  this.upDown = function (a, b, c, d, e) {
    if (void 0 != c && void 0 != d) {
      var f = this.el("label");
      f.className = d;
      f.onclick = function () {
        $("#" + b).slideToggle("normal", function () {
          f.className = f.className == c ? d : c;
          if (e)
            try {
              e();
            } catch (a) {}
        });
      };
      a.appendChild(f);
      return f;
    }
  };
  this.arrowUpDown = function (a, b, c) {
    this.upDown(a, b, "arrowUp", "arrowDown", c);
  };
  this.getChildNode = function (a, b, c) {
    a = a.childNodes;
    var d = [],
      e = 0,
      f;
    f = b.split(" ");
    b = f[0];
    for (var g = f[1], h = 0, k = a.length; h < k; h++)
      (f = a[h]),
        1 == f.nodeType &&
          f.tagName.toLowerCase() == b &&
          (void 0 != g && f.type == g
            ? ((d[e] = f), e++)
            : void 0 == g && ((d[e] = f), e++));
    return void 0 != c ? d[c] : d[0];
  };
  this.checkInHorize = function (a) {
    for (; null != a && "HTML" != a.nodeName.toUpperCase(); ) {
      if (
        "hidden" == this.getNodeDefaultView(a, "visibility") ||
        "none" == this.getNodeDefaultView(a, "display")
      )
        return !1;
      a = a.parentNode;
    }
    return !0;
  };
  this.setUrlHash = function (a, b) {
    var c, d, e;
    c = "";
    var f = location.href;
    d = location.hash;
    void 0 != a &&
      void 0 != b &&
      0 != a.length &&
      (0 != d.length
        ? ((e = d.indexOf(a)),
          0 <= e
            ? ((c = d.substring(0, e)),
              (d = d.substring(e)),
              (e = d.indexOf("#")),
              0 < e
                ? ((d = d.substring(e)), (d = c + a + "=" + b + d))
                : (d = c + a + "=" + b))
            : ("#" != d.substring(d.length - 1) && (c = "#"),
              (d += c + a + "=" + b)),
          (location.href = f.substring(0, f.indexOf("#")) + d))
        : f.lastIndexOf("#") == f.length - 1
        ? (location.href += a + "=" + b)
        : (location.href += "#" + a + "=" + b));
  };
  this.getUrlHash = function (a) {
    var b = location.hash,
      c,
      d = "";
    if (0 < b.indexOf(a)) {
      var b = b.substring(1).split("#"),
        e;
      for (e in b)
        if (((c = b[e].split("=")), c[0] == a)) {
          d = c[1];
          break;
        }
    }
    return d;
  };
  this.changeUrlHash = function (a) {
    var b = location.href,
      c = b.indexOf("#");
    void 0 != a &&
      (location.href = 0 < c ? b.substring(0, c + 1) + a : b + "#" + a);
  };
  this.setInputCursor = function (a) {
    this.setDomCursorPos(a, a.value.length);
  };
  this.getCNStrLen = function (a) {
    return a.replace(/[^\x00-\xFF]/g, "xxx").length;
  };
  this.getCNStrHTMLLen = function (a) {
    return a.replace(/[^\x00-\xFF]/g, "xx").length;
  };
  this.getDisplayStrLen = function (a) {
    return a.replace(/[^\x00-\xFF]/g, "xx").length;
  };
  this.getStrInMax = function (a, b) {
    var c = "",
      d,
      e = 0;
    d = a.replace(/[A-Z]/g, "xx");
    if (getCNStrHTMLLen(d) <= b) return a;
    for (var f = 1; f <= b; f++) {
      d = a.charAt(e);
      if ("" == d) break;
      2 == getCNStrHTMLLen(d) || !0 == /[A-Z]/g.test(d)
        ? (f++, (c += d), (beCut = !0))
        : (c += d);
      e++;
    }
    return c + "...";
  };
  this.getStrInMaxWithPixel = function (a, b, c) {
    var d;
    if (calStrLenPixel(a, b) <= c) return a;
    d = calStrLenPixel("...", b);
    return cutStrWithPixel(a, b, c - d) + "...";
  };
  this.cutStrWithPixel = function (a, b, c) {
    var d = "",
      e = 0,
      f = a.length,
      g = document.createElement("span");
    g.style.fontSize = b;
    g.style.visibility = "hidden";
    g.style.display = "inline-block";
    !0 == isIE &&
      !0 == isIENormal &&
      (g.style.wordBreak = "break-all !important");
    document.body.appendChild(g);
    for (
      b = 0;
      b < f &&
      !((g.innerHTML = " " == a[b] ? "&nbsp;" : a[b]),
      (e += g.offsetWidth),
      e >= c);
      b++
    )
      d += a[b];
    document.body.removeChild(g);
    return d;
  };
  this.calStrLenPixel = function (a, b) {
    var c = a.length,
      d = 0,
      e = document.createElement("span");
    e.style.fontSize = b + "px";
    e.style.visibility = "hidden";
    e.style.display = "inline-block";
    !0 == isIE &&
      !0 == isIENormal &&
      (e.style.wordBreak = "break-all !important");
    document.body.appendChild(e);
    for (var f = 0; f < c; f++)
      (e.innerHTML = " " == a[f] ? "&nbsp;" : a[f]), (d += e.offsetWidth);
    document.body.removeChild(e);
    return d;
  };
  this.EncodeURLIMG = document.createElement("img");
  this.escapeDBC = function (a) {
    var b = this.EncodeURLIMG;
    if (!a) return "";
    if (window.ActiveXObject)
      return (
        execScript('SetLocale "zh-cn"', "vbscript"),
        a.replace(/[\d\D]/g, function (a) {
          window.vbsval = "";
          execScript('window.vbsval=Hex(Asc("' + a + '"))', "vbscript");
          return (
            "%" + window.vbsval.slice(0, 2) + "%" + window.vbsval.slice(-2)
          );
        })
      );
    b.src = "nothing.png?separator=" + a;
    return b.src.split("?separator=").pop();
  };
  this.encodeURL = function (a) {
    return encodeURIComponent(a);
  };
  this.doNothing = function () {
    return !0;
  };
  this.htmlEscape = function (a) {
    void 0 != a &&
      (a = a.toString().replace(/[<>&"]/g, function (a) {
        switch (a) {
          case "<":
            return "&lt;";
          case ">":
            return "&gt;";
          case "&":
            return "&amp;";
          case '"':
            return "&quot;";
        }
      }));
    return a;
  };
  this.orgAuthPwd = function (a) {
    return this.securityEncode(
      a,
      "RDpbLfCPsJZ7fiv",
      "yLwVl0zKqws7LgKPRQ84Mdt708T1qQ3Ha7xv3H7NyU84p21BriUWBU43odz3iP4rBL3cD02KZciXTysVXiV8ngg6vL48rPJyAUw0HurW20xqxv9aYb4M9wK1Ae0wlro510qXeU07kV57fQMc8L6aLgMLwygtc0F10a0Dg70TOoouyFhdysuRMO51yY5ZlOZZLEal1h0t9YQW0Ko7oBwmCAHoic4HYbUyVeU3sfQ1xtXcPcf1aT303wAQhv66qzW"
    );
  };
  this.securityEncode = function (a, b, c) {
    var d = "",
      e,
      f,
      g,
      h,
      k = 187,
      l = 187;
    f = a.length;
    g = b.length;
    h = c.length;
    e = f > g ? f : g;
    for (var m = 0; m < e; m++)
      (l = k = 187),
        m >= f
          ? (l = b.charCodeAt(m))
          : m >= g
          ? (k = a.charCodeAt(m))
          : ((k = a.charCodeAt(m)), (l = b.charCodeAt(m))),
        (d += c.charAt((k ^ l) % h));
    return d;
  };
  this.simulateMouseC = function (a) {
    simulateMouseC =
      !0 == isIE && !1 == isIENormal
        ? function (a) {
            var c = document.createEventObject();
            c.sceenX = 100;
            c.sceenY = 0;
            c.clientX = 0;
            c.clientY = 0;
            c.ctrlKey = !1;
            c.altKey = !1;
            c.shiftKey = !1;
            c.button = 0;
            a.fireEvent("onclick", c);
          }
        : function () {};
    simulateMouseC(a);
  };
  this.emptyNodes = function (a) {
    for (; a && a.firstChild; ) a.removeChild(a.firstChild);
  };
  this.netSpeedTrans = function (a) {
    1073741824 <= a
      ? ((a = (a / 1073741824).toFixed(1)),
        100 <= a && (a = parseInt(a)),
        (a += "GB/s"))
      : 1048576 <= a
      ? ((a = (a / 1048576).toFixed(1)),
        100 <= a && (a = parseInt(a)),
        (a += "MB/s"))
      : ((a = (a / 1024).toFixed(1)),
        100 <= a && (a = parseInt(a)),
        (a += "KB/s"));
    return a;
  };
  this.adaptCNABrowserInput = function (a) {
    try {
      "NO" != gBeInCNA &&
        (id(a).onfocus = function () {
          var a = this,
            b = a.value;
          a.value = "";
          a.type = "password";
          $.setTimeout(function () {
            a.type = "text";
            a.value = b;
          }, 0);
        });
    } catch (b) {}
  };
}
function Switch(a, b, c, d, e, f) {
  this.switchId = a;
  this.switchCon = id(a);
  this.switchBall = $("#" + a + " i.switchBall")[0];
  this.switchBg = $("#" + a + " i.switchBg")[0];
  this.callback = c;
  this.stateChangeCallback = e;
  this.isFirstLoadTrigger = d;
  this.state = b;
  this.rightPos;
  this.disabled = !1;
  this.statusArray = f;
  "function" != typeof Switch.prototype.switchInit &&
    ((Switch.prototype.switchInit = function () {
      var a = this.state,
        b = this.switchBall,
        c = this.switchCon,
        d = this.switchBg;
      null != c &&
        null != b &&
        ((this.rightPos = c.offsetWidth - b.offsetWidth),
        this.setState(a),
        (void 0 == this.isFirstLoadTrigger || !1 != this.isFirstLoadTrigger) &&
          this.callback &&
          this.callback(a),
        (b.onmousedown = this.draggableBind()),
        (d.onclick = this.switchBgClick()));
    }),
    (Switch.prototype.setState = function (a) {
      var b = this.switchCon,
        c = this.switchBall,
        d = this.switchBg;
      this.state = a;
      b.value = a;
      c.style.left = a * this.rightPos + (1 == a ? -2 : 2) + "px";
      d.style.background =
        1 == a
          ? "url(../web-static/images/basic.png) no-repeat scroll -144px 0"
          : "url(../web-static/images/basic.png) no-repeat scroll -144px -16px";
      void 0 != this.stateChangeCallback && this.stateChangeCallback(a);
    }),
    (Switch.prototype.switchChgState = function (a) {
      a = 1 - a;
      this.setState(a);
      this.callback && this.callback(a);
    }),
    (Switch.prototype.switchCHandle = function () {
      var a = this.state,
        b = this.switchBall,
        c = 1 == a ? -1 : 1,
        d = parseInt(b.style.left),
        e = this.rightPos - 2,
        f = this;
      (1 == a && 2 >= d) || (0 == a && d >= e)
        ? this.switchChgState(a)
        : ((b.style.left = d + (c * e) / 8 + "px"),
          window.setTimeout(function () {
            f.switchCHandle();
          }, 20));
    }),
    (Switch.prototype.msMove = function (a, b, c) {
      b = b.x - c.x;
      c = this.switchCon.offsetWidth - a.offsetWidth - 2;
      b = 2 < b ? b : 2;
      a.style.left = (b > c ? c : b) + "px";
    }),
    (Switch.prototype.switchBgClick = function () {
      var a = this;
      return function (b) {
        b = b || window.event;
        b = b.target || b.srcElement;
        a.disabled || (a.switchBg == b && a.switchCHandle());
      };
    }),
    (Switch.prototype.draggableBind = function () {
      var a = this;
      return function (b) {
        b = b ? b : window.event;
        var c = getMousePos(b),
          d = b.target || b.srcElement;
        if (!a.disabled) {
          var e = { x: c.x - d.offsetLeft };
          document.onmousemove = function (b) {
            b = b ? b : window.event;
            b = getMousePos(b);
            clearSelection();
            a.msMove(d, b, e);
          };
          document.onmouseup = function (b) {
            clearSelection();
            document.onmousemove = null;
            document.onmouseup = null;
            a.switchCHandle();
          };
          stopProp(b);
        }
      };
    }),
    (Switch.prototype.disable = function (a) {
      var b = (this.disabled = a) ? "default" : "pointer";
      this.switchBall.style.cursor = b;
      this.switchCon.style.cursor = b;
      a
        ? ((this.switchBall.style.background =
            "url(../web-static/images/basic.png) no-repeat -178px -18px"),
          (this.switchBg.style.background =
            "url(../web-static/images/basic.png) no-repeat -144px -32px"))
        : ((this.switchBall.style.background =
            "url(../web-static/images/basic.png) no-repeat -178px -2px"),
          (this.switchBg.style.background =
            1 == this.state
              ? "url(../web-static/images/basic.png) no-repeat -144px 0"
              : "url(../web-static/images/basic.png) no-repeat -144px -16px"));
    }));
  this.switchInit();
}
function ShowTips() {
  this.alertTimeHd;
  this.shAltObjOrId;
  this.isGlobalShowLoadingWorking = !1;
  this.isGlobalShowLoadingTimeoutHandle = this.isGlobalShowLoadingHandle = null;
  this.requestShowLoadingCount = 0;
  this.showLoading = function () {
    var a = id("Loading"),
      b,
      c,
      d = $(window).width();
    c = $(window).height();
    0 == a.childNodes.length &&
      ((b = document.createElement("i")),
      (b.className = "iconfont icon-loading loading"),
      a.appendChild(b));
    b = a.childNodes[0];
    a = d / 2 - 24;
    c = c / 2 - 24;
    $(b).css("left", a);
    $(b).css("top", c);
    "block" != $("#Loading").css("display") && $("#Loading").fadeIn(250);
  };
  this.closeLoading = function (a) {
    "none" != $("#Loading").css("display") &&
      $("#Loading").fadeOut(250, function () {
        "function" == typeof a && a();
      });
  };
  this.showToastHandle = null;
  this.showToast = function (a) {
    var b = $("#Toast"),
      c = window.document.body.offsetWidth,
      d,
      e;
    e = Dialog.prototype.state.dialogArr;
    "block" == b.css("display") && b.trigger("ev_hide");
    b.html(a);
    d = b.innerWidth();
    a = b.innerHeight();
    0 == e.length
      ? ((c = c / 2 - d / 2), (a = 200))
      : ((e = $(e[e.length - 1].obj.container)),
        (c = parseInt(e.css("left")) + parseInt(e.actual("width")) / 2 - d / 2),
        (a =
          parseInt(e.css("top")) + parseInt(e.actual("height")) / 2 - a / 2));
    b.css("left", c);
    b.css("top", a);
    b.fadeTo(500, 0.8);
    showToastHandle = setTimeout(function () {
      showToastHandle = null;
      b.fadeOut(1e3);
    }, 2e3);
    b.off("ev_hide").on("ev_hide", function () {
      null != showToastHandle
        ? (clearTimeout(showToastHandle),
          b.css("opacity", "0").css("display", "none"))
        : b.stop(!1, !0);
    });
  };
  this.showPhWzdAlert = function (a, b) {
    this.showCover(
      function () {
        var c,
          d,
          e,
          f = this;
        c = id("phWzdAlertCon");
        null == c
          ? ((c = document.createElement("div")),
            (c.className = "phWzdAlertCon"),
            (c.id = "phWzdAlertCon"),
            document.body.appendChild(c),
            (d = document.createElement("img")),
            (d.src = "../web-static/images/phoneWarn.png"),
            c.appendChild(d),
            (d = document.createElement("p")),
            c.appendChild(d),
            (e = document.createElement("label")),
            (e.className = "btnY"),
            (e.innerHTML = btn.ok),
            c.appendChild(e))
          : ((d = $("#phWzdAlertCon p")[0]),
            (e = $("#phWzdAlertCon label")[0]));
        c.style.top = "120px";
        c.style.visibility = "visible";
        d.innerHTML = a;
        e.onclick = function () {
          "function" == typeof b && b();
          f.closePhWzdAlert();
        };
      },
      { opacity: 0.4 }
    );
  };
  this.closePhWzdAlert = function () {
    this.hideCover(function () {
      var a = id("phWzdAlertCon");
      null != a && ((a.style.top = "-9999px"), (a.style.visibility = "hidden"));
    });
  };
  this.showPhConfirm = function (a, b, c, d) {
    this.showCover(
      function () {
        var e,
          f,
          g,
          h,
          k = this,
          l = void 0 != c ? c : btn.ok,
          m = void 0 != d ? d : btn.cancel;
        e = id("phConfirmCon");
        null == e
          ? ((e = document.createElement("div")),
            (e.className = "phWzdAlertCon"),
            (e.id = "phConfirmCon"),
            document.body.appendChild(e),
            (f = document.createElement("img")),
            (f.src = "../web-static/images/phoneWarn.png"),
            e.appendChild(f),
            (f = document.createElement("p")),
            e.appendChild(f),
            (g = document.createElement("label")),
            (g.className = "btnY"),
            e.appendChild(g),
            (h = document.createElement("label")),
            (h.className = "btnN"),
            e.appendChild(h))
          : ((f = $("#phConfirmCon p")[0]),
            (g = $("#phConfirmCon label")[0]),
            (h = $("#phConfirmCon label")[1]));
        f.innerHTML = a;
        h.innerHTML = m;
        g.innerHTML = l;
        e.style.top = "120px";
        e.style.visibility = "visible";
        h.onclick = function () {
          k.closePhConfirm();
          "function" == typeof b && b(!1);
        };
        g.onclick = function () {
          k.closePhConfirm();
          "function" == typeof b && b(!0);
        };
      },
      { opacity: 0.4 }
    );
  };
  this.closePhConfirm = function () {
    this.hideCover(function () {
      var a = id("phConfirmCon");
      null != a && ((a.style.top = "-9999px"), (a.style.visibility = "hidden"));
    });
  };
  this.debugInfo = function () {
    for (var a = "", b = 0, c = arguments.length; b < c; b++)
      a += arguments[b] + "\r\n";
    alert(a);
  };
}
function Select() {
  this.selectInitExtern = function (a, b, c, d, e) {
    selectInit(a, b, c, d, e, {
      className: "appSelOptsUl",
      colorN: "#FFFFFF",
      colorC: "#95AE31",
      fontColorN: "#3C3E43",
      fontColorC: "#FFFFFF",
      valueColor: "#FFFFFF",
      valueDisColor: "#95AE31",
      scrollBg: "#95AE31",
      scrollZIndex: "1009",
    });
  };
  this.selectInitEptMgt = function (a, b, c, d, e) {
    selectInit(a, b, c, d, e, {
      className: "eptMgtSelOptsUl",
      colorN: "#FFFFFF",
      colorC: "#F17E50",
      fontColorN: "#3C3E43",
      fontColorC: "#FFFFFF",
      valueColor: "#FFFFFF",
      valueDisColor: "#F17E50",
      scrollBg: "#F17E50",
      scrollZIndex: "1009",
    });
  };
  this.selectInit = function (a, b, c, d, e, f) {
    function g(a) {
      for (
        var b, c, d = a.childNodes, e = $(a).prev(), f = 0, g = d.length;
        f < g;
        f++
      )
        (c = d[f]),
          (b = c.childNodes[0].style.visibility),
          (c.style.backgroundColor = "visible" == b ? w : x),
          (c.style.color = "visible" == b ? y : u);
      a.style.visibility = "hidden";
      a.style.top = "-9999px";
      a.parentNode.style.position = "static";
      n.hasClass("dropDown") && n.removeClass("dropDown").addClass("dropUp");
      e[0].state = "idle";
    }
    function h(b) {
      var c = id(a),
        e = b.parentNode,
        f = e.childNodes,
        g = $("#" + a + " span.value")[0];
      if (3 != b.childNodes[0].nodeType) {
        c.value = b.valueStr;
        g.value = b.valueStr;
        for (var h = 0, k = f.length; h < k; h++)
          (f[h].childNodes[0].style.visibility = "hidden"),
            (f[h].style.backgroundColor = x),
            (f[h].style.color = u),
            $(f[h]).removeClass("selected");
        "visible" != b.childNodes[0].style.visibility &&
          "undefined" != typeof d &&
          d(b.valueStr, c);
        $(b).addClass("selected");
        n.removeClass("dropDown").addClass("dropUp");
        b.childNodes[0].style.visibility = "visible";
        b.style.backgroundColor = w;
        b.style.color = y;
        g.innerHTML = htmlEscape(b.childNodes[1].nodeValue);
        e.style.visibility = "hidden";
        e.style.top = "-9999px";
        e.parentNode.style.position = "static";
      }
    }
    function k(a) {
      for (var b = 0, c = a.length; b < c; b++)
        (q = a[b]),
          (z = htmlEscape(getStrInMaxWithPixel(q.str.toString(), C, D))),
          (A = "hidden"),
          (m = document.createElement("li")),
          (m.className = "option"),
          (void 0 == q.value && b == v) || v == q.value
            ? ((A = "visible"),
              (t.innerHTML = z),
              (t.value = v),
              (p.value = v),
              (m.style.backgroundColor = w),
              (m.style.color = "#ff3366"),
              $(m).addClass("selected"))
            : (m.style.color = u),
          (m.innerHTML =
            "<span style='visibility:" +
            A +
            "' class='iconfont icon-ok'></span>" +
            z),
          (m.title = q.title || q.str),
          (m.valueStr = void 0 != q.value ? q.value : b),
          (m.onclick = function (a) {
            a = a || window.event;
            h(this);
            stopProp(a);
          }),
          (m.onmousemove = function (a) {
            a = a || window.event;
            a = a.srcElement || a.target;
            var b;
            if ("span" != a.tagName.toLowerCase()) {
              b = a.parentNode.childNodes;
              for (var c = 0, d = b.length; c < d; c++)
                (b[c].style.backgroundColor = x),
                  $(b[c]).hasClass("selected") || (b[c].style.color = u);
              a.style.backgroundColor = w;
              $(a).hasClass("selected") || (a.style.color = y);
            }
          }),
          r.appendChild(m);
    }
    function l(b) {
      var c = $("#" + s + a),
        d = $("ul." + s);
      n.hasClass("dropDown")
        ? (g(r), n.addClass("dropUp"))
        : (n.removeClass("dropUp").addClass("dropDown"),
          d.each(function () {
            "visible" == this.style.visibility && g(this);
            return !0;
          }),
          (d = parseInt($(c).parent().css("height"), 10) + 4),
          c.css("visibility", "visible").css("top", d + "px"),
          (c[0].parentNode.style.position = "relative"),
          (this.state = "focus"),
          stopProp(b));
    }
    var m,
      q,
      t,
      A = "hidden",
      r = document.createElement("ul"),
      p = id(a),
      s = "selOptsUl",
      x = "#FFFFFF",
      w = "#f5f5f5",
      u = "",
      y = "#333",
      n,
      D,
      C,
      B,
      z,
      v = c;
    c = p.parentNode;
    n = $("#" + a + " span.value");
    B = $("#" + a).parents("li.inputLi");
    u = n.css("color");
    t = n[0];
    t.value = 0;
    D = parseInt(
      "100%" == n.css("width")
        ? void 0 == e
          ? n.actual("width")
          : e
        : n.css("width")
    );
    C = parseInt(n.css("fontSize"));
    p.value = 0;
    r.className = s;
    r.id = s + a;
    void 0 != f &&
      !0 == f.unlimitOptionsHigh &&
      $(r).addClass("selOptsUlUnlimitHieght");
    c.appendChild(r);
    attachEvnt(document.body, "click", function () {
      var b = $("#" + s + a)[0];
      "undefined" != typeof b && g(b);
    });
    k(b);
    p.state = "idle";
    p.onclick = l;
    p.disable = function (a) {
      a
        ? ((p.onclick = null),
          (t.style.color = "#B2B2B2"),
          B.addClass("disabled"))
        : ((p.onclick = l),
          (t.style.color = "#000000"),
          B.removeClass("disabled"));
    };
    p.changeSel = function (b) {
      $("#" + s + a + " li");
      $("#" + s + a + " li").each(function () {
        if (this.valueStr == b) return h(this), !1;
      });
    };
    p.resetOptions = function (a, b) {
      r.innerHTML = "";
      v = b || 0;
      k(a);
    };
    b = new NiceScroll({ targetId: r.id });
    b.scrollTipOpacity(1);
    b.scrollTipSet({ background: "#999999" });
    b.init();
  };
}
function Help() {
  var a = this;
  this.help = "Help";
  this.helpDetail = "helpDetail";
  this.helpContent = "helpContent";
  this.helpURL = "Help.htm";
  this.helpInit = function () {
    var a = id(this.help),
      c,
      d,
      e = this;
    0 != a.innerHTML.length
      ? loadDialogRenderPage(this.helpURL, this.helpContent)
      : ((c = document.createElement("p")),
        (c.className = "helpTop"),
        (c.onmousedown = this.draggableBind(this.help)),
        a.appendChild(c),
        (d = document.createElement("span")),
        (d.className = "helpDes"),
        (d.innerHTML = label.help),
        c.appendChild(d),
        (d = document.createElement("i")),
        (d.onclick = function () {
          e.helpClose();
        }),
        (d.className = "helpClose iconfont icon-close"),
        c.appendChild(d),
        (d = document.createElement("div")),
        (d.id = "helpDetail"),
        a.appendChild(d),
        (d = document.createElement("div")),
        (d.style.display = "none"),
        (d.id = this.helpContent),
        document.body.appendChild(d),
        loadDialogRenderPage(this.helpURL, this.helpContent),
        attachEvnt(c, "touchstart", function (a) {
          a = a || window.event;
          e.mousePos = { x: a.touches[0].clientX, y: a.touches[0].clientY };
          attachEvnt(document, "touchmove", touchMoveHd);
          attachEvnt(document, "touchend", touchEndHd);
        }));
  };
  this.touchMoveHd = function (b) {
    b = b || window.event;
    var c = b.touches[0].clientX,
      d = b.touches[0].clientY,
      e = id(a.help),
      c = c - a.mousePos.x,
      d = d - a.mousePos.y,
      f = document.body.clientWidth - e.offsetWidth,
      g = document.documentElement.scrollHeight - e.offsetHeight,
      c = 0 < c ? c : 0,
      d = 0 < d ? d : 0;
    e.style.left = (c > f ? f : c) + "px";
    e.style.top = (d > g ? g : d) + "px";
    eventPreventDefault(b);
    clearSelection(b);
  };
  this.touchEndHd = function (a) {
    detachEvnt(document, "touchmove", touchMoveHd);
    detachEvnt(document, "touchend", touchEndHd);
  };
  this.helpBind = function (a, c) {
    a &&
      (a.onclick = function (a) {
        a = a || window.event;
        helpShow(c, a.target || a.srcElement);
      });
  };
  this.helpClose = function () {
    var a = id(this.help),
      c = id(this.helpDetail);
    null != c &&
      null != a &&
      (setStyle(a, { visibility: "hidden", top: "-9999px" }),
      (c.innerHTML = ""));
  };
  this.helpVisible = function (a) {
    var c = id(this.help),
      d = $(a).offset(),
      e = c.offsetWidth;
    a = a.offsetHeight;
    var f = $("#menuLoader"),
      e = f.offset().left + parseInt((f[0].offsetWidth - e) / 2) + "px";
    setStyle(c, { visibility: "visible", top: d.top + a + "px", left: e });
  };
  this.helpDetailAppend = function (a) {
    var c = id(a);
    null != c && ((a = id(this.helpDetail)), (a.innerHTML = c.outerHTML));
  };
  this.helpShow = function (a, c) {
    this.helpClose();
    this.helpVisible(c);
    helpDetailAppend(a);
  };
  this.msMove = function (a, c, d) {
    var e = c.x - d.x;
    c = c.y - d.y;
    d = document.body.clientWidth - a.offsetWidth;
    var f = document.documentElement.scrollHeight - a.offsetHeight,
      e = 0 < e ? e : 0;
    c = 0 < c ? c : 0;
    a.style.left = (e > d ? d : e) + "px";
    a.style.top = (c > f ? f : c) + "px";
  };
  this.draggableBind = function (a) {
    var c = id(a);
    return function (a) {
      a = a ? a : window.event;
      a = getMousePos(a);
      var b = { x: a.x - c.offsetLeft, y: a.y - c.offsetTop };
      document.onmousemove = function (a) {
        a = a ? a : window.event;
        a = getMousePos(a);
        clearSelection();
        msMove(c, a, b);
      };
      document.onmouseup = function () {
        clearSelection();
        document.onmousemove = null;
        document.onmouseup = null;
      };
    };
  };
}
function Tips() {
  this.addTitleError = function (a, b) {
    var c, d, e;
    c = $("div.head");
    0 != c.length &&
      void 0 != a &&
      "string" == typeof a &&
      void 0 != b &&
      "string" == typeof b &&
      ((d = c.find("#highsetTitleError")),
      0 == d.length &&
        ((d = el("p")),
        (d.id = "highsetTitleError"),
        (d.className = "commonErrTip highsetCommonErrTip"),
        (e = el("i")),
        (e.className = "iconfont icon-error"),
        d.appendChild(e),
        $(d).css("width", $(c[0]).actual("width") - 24),
        c[0].appendChild(d),
        (d = c.find("#highsetTitleError"))),
      0 == d.find("#" + a).length &&
        ((c = el("span")), (c.id = a), (c.innerHTML = b), d.append(c)));
  };
  this.removeTitleError = function (a) {
    var b;
    b = $("div.head");
    0 != b.length &&
      ((b = b.find("#highsetTitleError")),
      0 != b.length &&
        (b.find("#" + a).remove(), 0 == b.find("span").length && b.remove()));
  };
  this.addTitleWarning = function (a) {};
}
function LanDetect() {
  this.lanDetectSuccess = !1;
  this.LAN_DETECT_TIME = 1e3;
  this.lanDetectTimeHd = null;
  this.lanDetectHandle = function (a) {
    !1 == $.result.timeout &&
      !1 == this.lanDetectSuccess &&
      ((this.lanDetectSuccess = !0), clearTimeout(this.lanDetectTimeHd), a());
  };
  this.lanDetecting = function (a) {
    this.lanDetectSuccess = !1;
    $.detect(function () {
      lanDetectHandle(a);
    });
    this.lanDetectTimeHd = $.setTimeout(function () {
      lanDetecting(a);
    }, this.LAN_DETECT_TIME);
  };
}
function CloudHistory(a) {
  this.container = a.container;
  this.track = a.track;
  this.state = {
    account: null,
    pwd: null,
    bind: !1,
    createSuccessAndLoginFail: !1,
  };
  this.cursor = 0;
  this.isFormWizard = a.isFormWizard || !1;
  "function" != typeof CloudHistory.prototype.go &&
    ((CloudHistory.prototype.go = function (a) {
      a = this.cursor + a;
      0 > a ||
        a >= this.track.length ||
        (this.isFormWizard
          ? loadPage(this.track[a].page, this.container, this.track[a].callback)
          : loadDialogRenderPage(
              this.track[a].page,
              this.container,
              this.track[a].callback
            ),
        (this.cursor = a));
    }),
    (CloudHistory.prototype.setState = function (a) {
      for (var c in a) this.state[c] = a[c];
    }),
    (CloudHistory.prototype.getState = function (a) {
      return this.state[a];
    }));
}
function refreshRoutine() {
  var a = {};
  a[uciCloudConfig.fileName] = {};
  a[uciCloudConfig.fileName][KEY_NAME] = [
    uciCloudConfig.secName.newFirmware,
    uciCloudConfig.secName.deviceStatus,
    uciCloudConfig.secName.bind,
  ];
  1 == slp.moduleSpec.wifison_mesh &&
    ((a[uciPlc.fileName] = {}),
    (a[uciPlc.fileName][KEY_TABLE] = uciPlc.secType.connectedExt));
  $.query(
    a,
    function (a) {
      var c,
        d,
        e,
        f = 0;
      if (ENONE == a[ERR_CODE]) {
        c =
          a[uciCloudConfig.fileName][uciCloudConfig.secName.newFirmware][
            uciCloudConfig.optName.fwNewNotify
          ] == uciCloudConfig.optValue.fwNewTrue;
        d =
          a[uciCloudConfig.fileName][uciCloudConfig.secName.deviceStatus][
            uciCloudConfig.optName.bindStatus
          ];
        e = htmlEscape(
          a[uciCloudConfig.fileName][uciCloudConfig.secName.bind][
            uciCloudConfig.optName.username
          ]
        );
        if (1 == slp.moduleSpec.wifison_mesh) {
          a = formatTableData(a[uciPlc.fileName][uciPlc.secType.connectedExt]);
          for (var g = 0, h = a.length; g < h; g++) {
            var k = a[g];
            k.cur_fw_version =
              "" == k.cur_fw_version.split(" ")[0]
                ? label.canNotDetect
                : k.cur_fw_version.split(" ")[0];
            k.newest_fw_version =
              (k.newest_fw_version && k.newest_fw_version.split(" ")[0]) ||
              k.cur_fw_version;
            k[uciPlc.optName.supportOlUp] == uciPlc.optValue.supportOlUp.yes &&
              k.cur_fw_version != label.canNotDetect &&
              k.newest_fw_version != label.canNotDetect &&
              k.newest_fw_version != k.cur_fw_version &&
              f++;
          }
        }
        c = c || 0 < f;
        $(id("navHighSet")).trigger("showTag", [c]);
        $("#sysTool_menu")
          .find("i.menuLiTag")
          .css("display", c ? "block" : "none");
        $("#sysTool_menu")
          .parent()
          .find("li")
          .each(function () {
            $(this).find("label").text() == menuStr.upgrade &&
              $(this)
                .find("i.subMenuLiTag")
                .css("display", c ? "block" : "none");
          });
        cloudHistory.setState({
          account: e,
          bind: d == uciCloudConfig.optValue.bindStatusBind ? !0 : !1,
        });
        refreshNavBarCloudStatus();
        cloudRefreshHandle = setTimeout(function () {
          refreshRoutine();
        }, cloudRefreshPeriod);
      }
    },
    void 0,
    !0
  );
}
function refreshNavBarCloudStatus() {
  !1 == cloudHistory.getState("bind")
    ? (id("mercuryId").innerHTML = label.cloudIdNoBind)
    : (id("mercuryId").innerHTML = cloudHistory.getState("account"));
}
function CloudCommon() {
  this.cloudRefreshHandle = null;
  this.cloudRefreshPeriod = 1e4;
  this.cloudHistory = null;
  this.pushCloudIDSuggestDialog = this.pushCloudUpgradeDialog = !1;
  this.cloudAccountEmailList = [
    { key: "gmail.com", value: "https://mail.google.com" },
    { key: "live.com", value: "http://mail.live.com" },
    { key: "live.cn", value: "http://mail.live.com" },
    { key: "hotmail.com", value: "http://mail.live.com" },
    { key: "outlook.com", value: "http://mail.live.com" },
    { key: "qq.com", value: "http://mail.qq.com" },
    { key: "126.com", value: "http://mail.126.com" },
    { key: "163.com", value: "http://mail.163.com" },
    { key: "yeah.net", value: "http://mail.yeah.net" },
    { key: "sina.com", value: "http://mail.sina.com.cn" },
    { key: "sohu.com", value: "http://mail.sohu.com" },
    { key: "21cn.com", value: "http://mail.21cn.com" },
    { key: "sina.com.cn", value: "http://mail.sina.com.cn" },
    { key: "tom.com", value: "http://mail.tom.com" },
    { key: "sogou.com", value: "http://mail.sogou.com" },
    { key: "foxmail.com", value: "http://mail.foxmail.com" },
    { key: "188.com", value: "http://mail.188.com" },
    { key: "wo.cn", value: "http://mail.wo.cn" },
    { key: "189.cn", value: "http://mail.189.cn" },
    { key: "139.com", value: "http://mail.10086.cn" },
    { key: "eyou.com", value: "http://www.eyou.com" },
    { key: "aliyun.com", value: "http://mail.aliyun.com" },
    { key: "263.net", value: "http://mail.263.net" },
    { key: "2980.com", value: "http://www.2980.com" },
  ];
  this.emailLinkCheck = function (a) {
    for (var b in cloudAccountEmailList) {
      var c = cloudAccountEmailList[b];
      if (0 < a.indexOf(c.key)) return c.value;
    }
    return null;
  };
  this.cloudRefreshFunc = function () {
    var a = {},
      b = uciCloudConfig;
    a[b.fileName] = {};
    a[b.fileName][KEY_NAME] = [
      b.secName.newFirmware,
      b.secName.deviceStatus,
      b.secName.bind,
    ];
    $.query(a, function (a) {
      if (ENONE == a[ERR_CODE]) {
        try {
          basicMenuNewUpgradeSet(
            a[b.fileName][b.secName.newFirmware][b.optName.fwNewNotify] ==
              b.optValue.fwNewTrue
          ),
            a[b.fileName][b.secName.deviceStatus][b.optName.bindStatus] ==
            b.optValue.bindStatusBind
              ? basicCloudSet(
                  !0,
                  a[b.fileName][b.secName.bind][b.optName.username]
                )
              : basicCloudSet(!1);
        } catch (d) {
          debugInfo(d);
        }
        cloudRefreshHandle = window.setTimeout(cloudRefreshFunc, 1e4);
      }
    });
  };
  this.basicMenuNewUpgradeSet = function (a) {
    var b = id("sysTool_menu"),
      c,
      d = $("ul.headFunc").find("li")[1],
      e = $(d).find("i"),
      f = $("#sysTool_menu2").find("i")[0];
    void 0 == e[0] &&
      ((c = el("i")),
      (c.style.visibility = "hidden"),
      (c.className = "highSetTip"),
      d.appendChild(c),
      (e = $(d).find("i")));
    !0 == a
      ? (void 0 != b &&
          ((c = $("#sysTool_menu i.devTipImg")),
          void 0 == c[0]
            ? ((c = el("i")), (c.className = "devTipImg"), b.appendChild(c))
            : c.css("visibility", "visible")),
        void 0 != f && (f.className = "subImgY"),
        e.css("visibility", "visible"))
      : (void 0 != b &&
          ((c = $("#sysTool_menu i.devTipImg")),
          void 0 != c[0] && c.css("visibility", "hidden")),
        void 0 != f && (f.className = "subImg"),
        e.css("visibility", "hidden"));
  };
  this.basicCloudSet = function (a, b) {
    a
      ? (($("#cloudHeadFunc a")[0].style.display = "none"),
        ($("#cloudHeadFunc a")[0].onclick = null),
        ($("#cloudHeadFunc a")[1].style.display = "none"),
        ($("#cloudHeadFunc a")[1].onclick = null),
        ($("#cloudHeadFunc a")[2].style.display = "inline"),
        ($("#cloudHeadFunc a")[2].innerHTML = b),
        ($("#cloudHeadFunc a")[2].onclick = function () {
          loadPage("Advance.htm", "Con");
        }))
      : (($("#cloudHeadFunc a")[0].style.display = "inline"),
        ($("#cloudHeadFunc a")[0].onclick = function () {
          cloudSetBackBRHd(basicBRGoBackHandle);
          showCloudPage("CloudBindCfg.htm");
        }),
        ($("#cloudHeadFunc a")[1].style.display = "inline"),
        ($("#cloudHeadFunc a")[1].onclick = function () {
          cloudSetBackBRHd(basicBRGoBackHandle);
          showCloudPage("CloudRegistCfg.htm");
        }),
        ($("#cloudHeadFunc a")[2].style.display = "none"),
        ($("#cloudHeadFunc a")[2].innerHTML = ""),
        ($("#cloudHeadFunc a")[2].onclick = null));
  };
  this.basicBRGoBackHandle = function (a) {
    var b = a.binded;
    a = a.account;
    !0 == b &&
      (basicCloudSet(b, a),
      null != id("cloudFirstTitle") &&
        loadPage("CloudAccountCfg.htm", "hcDetail"));
  };
  this.startCloudRefresh = function () {
    null == cloudRefreshHandle && cloudRefreshFunc();
  };
  this.stopCloudRefresh = function () {
    null != cloudRefreshHandle &&
      (window.clearTimeout(cloudRefreshHandle), (cloudRefreshHandle = null));
  };
  this.gCloudColObj = { cloudBackHd: null, cloudBackBRHd: null, account: "" };
  this.cloudSetBackHd = function (a) {
    gCloudColObj.cloudBackHd = a;
  };
  this.cloudGoBack = function () {
    var a = gCloudColObj.cloudBackHd;
    "function" == typeof a && a();
  };
  this.cloudSetBackBRHd = function (a) {
    gCloudColObj.cloudBackBRHd = a;
  };
  this.cloudGoBackBR = function (a) {
    var b = gCloudColObj.cloudBackBRHd;
    hideCloudPage();
    "function" == typeof b && b(a);
  };
  this.gCloudAccountBR = {
    bodyHeight: 0,
    account: "",
    pwd: "",
    CAPTCHAR: "",
    accountType: "",
    success: !1,
    noteF: "",
    noteS: "",
    pwdLen: 0,
    softVersion: "",
    bFWzd: !1,
    registSuccess: !1,
  };
  this.cloudPageSetNodes = function (a) {
    var b = "none",
      c = "none",
      d,
      e = document.body.childNodes;
    !0 == a
      ? ((c = "block"),
        (b = "none"),
        (gCloudAccountBR.bodyHeight = parseInt(document.body.offsetHeight)),
        (document.body.style.height = "auto"))
      : ((c = "none"),
        (b = "block"),
        (document.body.style.height = gCloudAccountBR.bodyHeight + "px"));
    for (var f in e)
      (d = e[f]),
        void 0 != d.nodeName &&
          "DIV" == d.nodeName.toUpperCase() &&
          (d.id == this.cloudPageId
            ? setStyle(d, { display: c })
            : "Con" == d.id
            ? !0 == a
              ? ((d.style.visibility = "hidden"),
                (d.style.position = "absolute"),
                (d.style.top = "-9999px"))
              : ((d.style.visibility = "visible"),
                (d.style.position = "static"),
                (d.style.top = "0px"))
            : (d.id == this.loginId && d.id == this.coverId) ||
              setStyle(d, { display: b }));
    id(this.loginId).style.display = "none";
    id(this.coverId).style.display = "none";
  };
  this.appendErrCode = function (a, b) {
    return (
      a +
      label.lBrackets +
      errStr.errCode +
      label.colon +
      parseInt(b) +
      label.rBrackets
    );
  };
  this.cloudErrHandle = function (a) {
    a = parseInt(a);
    switch (a) {
      case EINVCLOUDERRORPARSEJSON:
      case EINVCLOUDERRORPARSEJSONNULL:
      case EINVCLOUDERRORPARSEJSONID:
      case EINVCLOUDCLIENTGENERIC:
      case EINVCLOUDCLIENTPARSEDNSREQUEST:
      case EINVCLOUDCLIENTESTABLISHTCP:
      case EINVCLOUDCLIENTWANIPCHANGE:
      case EINVCLOUDCLIENTDISCONNECTFIN:
      case EINVCLOUDCLIENTDISCONNECTRST:
      case EINVCLOUDCLIENTDISCONNECT:
      case EINVCLOUDCLIENTDISCONNECTSOCKETERRNUM:
      case EINVCLOUDCLIENTWANPHYPORTLINKDOWN:
      case EINVCLOUDCLIENTDOWNLOADPARSEDNSREQUEST:
      case EINVCLOUDCLIENTDOWNLOADESTABLISHTCP:
      case EINVCLOUDCLIENTDOWNLOADHTTPNOTOK:
      case EINVCLOUDCLIENTDOWNLOADTIMEOUT:
        showStr = errStr.invNetworkErr;
        break;
      case EINVCLOUDERRORGENERIC:
      case EINVCLOUDERRORSERVERINTERNALERROR:
      case EINVCLOUDERRORPERMISSIONDENIED:
      case EINVCLOUDERRORSERVERBUSY:
      case EINVCLOUDCLIENTHEARTREQUESTTIMEOUT:
      case EINVCLOUDCLIENTSTOPCONNECT:
      case EINVCLOUDCLIENTHELLOCLOUD:
      case EINVCLOUDCLIENTPUSHPLUGININFO:
      case EINVCLOUDCLIENTGETFWLIST:
      case EINVCLOUDCLIENTGETINITFWLIST:
        showStr = errStr.invServerBusy;
        break;
      case EINVCLOUDCLIENTSSLSIGNERROR:
      case EINVCLOUDCLIENTSSLDOMAINERROR:
      case EINVCLOUDCLIENTSSLTIMEERROR:
      case EINVCLOUDCLIENTSSLENCRYPTIONNOTMATCH:
        showStr = errStr.invConnectServerFailed;
        break;
      case EINVCLOUDCLIENTDEVICEILLEGAL:
        showStr = errStr.invCloudDeviceIdErr;
        break;
      case EINVERRORPERMISSIONDENIED:
        showStr = errStr.invPermissionDeny;
        break;
      case EINVCLOUDERRORMETHODNOTFOUND:
      case EINVCLOUDERRORPARAMSNOTFOUND:
      case EINVCLOUDERRORPARAMSWRONGTYPE:
      case EINVCLOUDERRORPARAMSWRONGRANGE:
      case EINVCLOUDERRORINVALIDPARAMS:
        showStr = errStr.invRequestFail;
        break;
      case EINVCLOUDERRORBINDDEVICEERROR:
        showStr = errStr.invMEIDLgFail;
        break;
      case EINVCLOUDERRORUNBINDDEVICEERROR:
        showStr = errStr.invMEIDUnBindFail;
        break;
      case EINVCLOUDERRORHWIDNOTFOUND:
      case EINVCLOUDERRORFWIDNOTSUPPORTDEVICE:
        showStr = errStr.cloudDeviceInfoExpt;
        break;
      case EINVCLOUDERRORDEVICEALIASFORMATERROR:
        showStr = errStr.invRouterNameFormat;
        break;
      case EINVCLOUDERRORACCOUNTUSERNAMEFORMATERROR:
        showStr = errStr.invCloudAccountFmtErr;
        break;
      case EINVCLOUDERRORACCOUNTACTIVEMAILSENDFAIL:
      case EINVCLOUDERRORRESETMAILSENDFAIL:
        showStr = errStr.invCAPTCHASendFail;
        break;
      case EINVCLOUDERRORTOKENEXPRIED:
      case EINVCLOUDERRORTOKENINCORRECT:
        showStr = errStr.invMEIDTimeout;
        break;
      case EINVCLOUDERRORACCOUNTACTIVEFAIL:
      case EINVCLOUDERRORACCOUNTACTIVETIMEOUT:
        showStr = errStr.invAccountCheckFail;
        break;
      case EINVCLOUDERRORRESETPWDTIMEOUT:
      case EINVCLOUDERRORRESETPWDFAIL:
        showStr = errStr.invAccountRstPwdFail;
        break;
      default:
        return { result: !0 };
    }
    showStr = appendErrCode(showStr, a);
    return { result: !1, tip: showStr };
  };
}
function CloudAction() {
  this.cloudActionQueryStatusWaitHd = this.cloudActionQueryStatusHd = null;
  this.cloudActionQueryStoped = this.cloudActionStatusQuering = !1;
  this.CLOUD_STATUS_QUERY_TIMEOUT = 1e3;
  this.CLOUD_STATUS_QUERY_TIMEOUT_WAIT = 2e4;
  this.cloudParseHandle = this.cloudCloseLoadingHandle = null;
  this.cloudResultType = {
    FINISH: 0,
    ACTION_ERROR: 1,
    QUERY_ALL_TIMEOUT: 2,
    QUERY_REQ_TIMEOUT: 3,
    EXCEPTION: 4,
    CLOSE: 5,
  };
  this._cloudParseError = function (a) {
    var b = "";
    switch (parseInt(a)) {
      case ENONE:
        return { result: !0 };
      case EINVSENDREQMSGFAILED:
        b = errStr.invSendReqMsgFailed;
        break;
      case ESYSBUSY:
      case EINVLASTOPTIONISNOTFINISHED:
        b = errStr.invLastOptionIsNotFinished;
        break;
      case ESYSTEM:
        b = errStr.invRequestFail;
        break;
      case ENOMEMORY:
        b = errStr.invMemoryOut;
        break;
      case EINVGETDATAFAILED:
        b = errStr.invGetDataFailed;
        break;
      case EINVPARAMETER:
        b = errStr.invParameter;
        break;
      case EINVREQUESTTIMEOUT:
        b = appendErrCode(errStr.invRequestFailTrylater, a);
        break;
      case EINVDEVICEIDNOTEXIST:
      case EINVERRORDEVICEIDFORMATERROR:
      case EINVILLEGALDEVICE:
        b = appendErrCode(errStr.cloudDeviceInfoExpt, a);
        break;
      default:
        b = cloudErrHandle(a);
        if (!1 == b.result) {
          b = b.tip;
          break;
        }
        b = errStr.invRequestFail;
    }
    return { result: !1, errCode: a, errStr: b };
  };
  this._setCloudHandle = function (a) {
    cloudParseHandle = a;
  };
  this.cloudAccountQueryStop = function () {
    cloudActionQueryStoped = !0;
    cloudActionStatusQuering = !1;
    clearTimeout(cloudActionQueryStatusHd);
    clearTimeout(cloudActionQueryStatusWaitHd);
    cloudParseHandle(cloudResultType.CLOSE);
    _setCloudHandle(null);
  };
  this._cloudStatusDataOrg = function (a) {
    var b = {},
      c = cloudClientStatus;
    b[c.fileName] = {};
    b[c.fileName][KEY_NAME] = a;
    return b;
  };
  this._cloudAccountStatus = function (a) {
    cloudActionStatusQuering = !0;
    $.query(
      _cloudStatusDataOrg(a),
      function (b) {
        var c = _cloudParseError(b[ERR_CODE]);
        if (!0 == c.result) {
          var d = cloudClientStatus,
            e = parseInt(b[d.fileName][a][d.optName.actionStatus]),
            d = d.optValue.queryStatus;
          switch (e) {
            case d.idle:
            case d.max:
              c = _cloudParseError(b[ERR_CODE]);
              cloudParseHandle(cloudResultType.EXCEPTION, c);
              break;
            case d.timeout:
              clearTimeout(cloudActionQueryStatusWaitHd);
              c = _cloudParseError(EINVREQUESTTIMEOUT);
              cloudParseHandle(cloudResultType.QUERY_REQ_TIMEOUT, c);
              break;
            case d.prepare:
            case d.trying:
              cloudActionQueryStatusHd = $.setTimeout(function () {
                _cloudAccountStatus(a);
              }, CLOUD_STATUS_QUERY_TIMEOUT);
              return;
            case d.failed:
            case d.success:
              cloudParseHandle(cloudResultType.FINISH, c, b);
              break;
            default:
              (c = _cloudParseError(ESYSTEM)),
                cloudParseHandle(cloudResultType.EXCEPTION, c);
          }
        } else
          cloudParseHandle(cloudResultType.EXCEPTION, c), _setCloudHandle(null);
        cloudActionStatusQuering = !1;
        clearTimeout(cloudActionQueryStatusWaitHd);
      },
      void 0,
      !0
    );
  };
  this._cloudActionQueryStatus = function (a, b) {
    var c;
    !0 != cloudActionQueryStoped &&
      (!0 == cloudActionStatusQuering && !1 == b
        ? ((c = _cloudParseError(EINVLASTOPTIONISNOTFINISHED)),
          cloudParseHandle(cloudResultType.EXCEPTION, c))
        : ((cloudActionStatusQuering = !1),
          clearTimeout(cloudActionQueryStatusHd),
          clearTimeout(cloudActionQueryStatusWaitHd),
          (cloudActionQueryStatusWaitHd = $.setTimeout(function () {
            cloudActionStatusQuering = !1;
            clearTimeout(cloudActionQueryStatusHd);
            c = _cloudParseError(EINVREQUESTTIMEOUT);
            cloudParseHandle(cloudResultType.QUERY_ALL_TIMEOUT, c);
          }, CLOUD_STATUS_QUERY_TIMEOUT_WAIT)),
          _cloudAccountStatus(a)));
  };
  this.cloudAccountRstPwdCheckCAPTCHA = function (a, b, c) {
    var d,
      e = {},
      f = uciCloudConfig;
    e[f.fileName] = {};
    d = e[f.fileName][f.actionName.checkResetPwdVerifyCode] = {};
    d[f.optName.username] = a;
    d[f.optName.verifyCode] = b;
    cloudActionQueryStoped = !1;
    _setCloudHandle(c);
    $.action(
      e,
      function (a) {
        !0 != cloudActionQueryStoped &&
          ((a = _cloudParseError(a[ERR_CODE])),
          !0 == a.result
            ? _cloudActionQueryStatus(
                cloudClientStatus.secName.checkResetPwdVerifyCode,
                !0
              )
            : (cloudParseHandle(cloudResultType.ACTION_ERROR, a),
              _setCloudHandle(null)));
      },
      !0,
      !0
    );
  };
  this.cloudAccountRstPwdAC = function (a, b, c) {
    var d,
      e = {},
      f = uciCloudConfig;
    e[f.fileName] = {};
    d = e[f.fileName][f.actionName.getResetPwdVerifyCode] = {};
    d[f.optName.username] = a;
    d[f.optName.accountType] = b;
    cloudActionQueryStoped = !1;
    _setCloudHandle(c);
    $.action(
      e,
      function (a) {
        !0 != cloudActionQueryStoped &&
          ((a = _cloudParseError(a[ERR_CODE])),
          !0 == a.result
            ? _cloudActionQueryStatus(
                cloudClientStatus.secName.getResetPwdVerifyCode,
                !0
              )
            : (cloudParseHandle(cloudResultType.ACTION_ERROR, a),
              _setCloudHandle(null)));
      },
      !0,
      !0
    );
  };
  this.cloudAccountRstPwd = function (a, b, c, d, e) {
    var f,
      g = {},
      h = uciCloudConfig;
    g[h.fileName] = {};
    f = g[h.fileName][h.actionName.resetPassword] = {};
    f[h.optName.username] = a;
    f[h.optName.verifyCode] = c;
    f[h.optName.password] = b;
    f[h.optName.accountType] = d;
    cloudActionQueryStoped = !1;
    _setCloudHandle(e);
    $.action(
      g,
      function (a) {
        !0 != cloudActionQueryStoped &&
          ((a = _cloudParseError(a[ERR_CODE])),
          !0 == a.result
            ? _cloudActionQueryStatus(
                cloudClientStatus.secName.resetPassword,
                !0
              )
            : (cloudParseHandle(cloudResultType.ACTION_ERROR, a),
              _setCloudHandle(null)));
      },
      !0,
      !0
    );
  };
  this.cloudAccountBind = function (a, b, c) {
    var d,
      e = {},
      f = uciCloudConfig;
    e[f.fileName] = {};
    d = e[f.fileName][f.actionName.bind] = {};
    d[f.optName.username] = a;
    d[f.optName.password] = b;
    cloudActionQueryStoped = !1;
    _setCloudHandle(c);
    $.action(
      e,
      function (a) {
        !0 != cloudActionQueryStoped &&
          ((a = _cloudParseError(a[ERR_CODE])),
          !0 == a.result
            ? _cloudActionQueryStatus(cloudClientStatus.secName.bind, !0)
            : (cloudParseHandle(cloudResultType.ACTION_ERROR, a),
              _setCloudHandle(null)));
      },
      !0,
      !0
    );
  };
  this.cloudAccountGetRegistAC = function (a, b, c) {
    var d,
      e = {},
      f = uciCloudConfig;
    e[f.fileName] = {};
    d = e[f.fileName][f.actionName.getRegVerifyCode] = {};
    d[f.optName.username] = a;
    d[f.optName.accountType] = b;
    cloudActionQueryStoped = !1;
    _setCloudHandle(c);
    $.action(
      e,
      function (a) {
        !0 != cloudActionQueryStoped &&
          ((a = _cloudParseError(a[ERR_CODE])),
          !0 == a.result
            ? _cloudActionQueryStatus(
                cloudClientStatus.secName.getRegVerifyCode,
                !0
              )
            : (cloudParseHandle(cloudResultType.ACTION_ERROR, a),
              _setCloudHandle(null)));
      },
      !0,
      !0
    );
  };
  this.cloudAccountRegist = function (a, b, c, d, e) {
    var f,
      g = {},
      h = uciCloudConfig;
    g[h.fileName] = {};
    f = g[h.fileName][h.actionName.register] = {};
    f[h.optName.username] = a;
    f[h.optName.accountType] = b;
    f[h.optName.verifyCode] = d;
    f[h.optName.password] = c;
    cloudActionQueryStoped = !1;
    _setCloudHandle(e);
    $.action(
      g,
      function (a) {
        !0 != cloudActionQueryStoped &&
          ((a = _cloudParseError(a[ERR_CODE])),
          !0 == a.result
            ? _cloudActionQueryStatus(cloudClientStatus.secName.register, !0)
            : (cloudParseHandle(cloudResultType.ACTION_ERROR, a),
              _setCloudHandle(null)));
      },
      !0,
      !0
    );
  };
  this.cloudAccountUnind = function (a) {
    var b = {},
      c = uciCloudConfig;
    b[c.fileName] = {};
    b[c.fileName][c.actionName.unbind] = {};
    cloudActionQueryStoped = !1;
    _setCloudHandle(a);
    $.action(
      b,
      function (a) {
        !0 != cloudActionQueryStoped &&
          ((a = _cloudParseError(a[ERR_CODE])),
          !0 == a.result
            ? _cloudActionQueryStatus(cloudClientStatus.secName.unbind, !0)
            : (cloudParseHandle(cloudResultType.ACTION_ERROR, a),
              _setCloudHandle(null)));
      },
      !0,
      !0
    );
  };
  this.cloudAccountModifyPwd = function (a, b, c) {
    var d,
      e = {},
      f = uciCloudConfig;
    e[f.fileName] = {};
    d = e[f.fileName][f.actionName.modifyAccountPwd] = {};
    d[f.optName.oldPassword] = a;
    d[f.optName.newPassword] = b;
    cloudActionQueryStoped = !1;
    _setCloudHandle(c);
    $.action(
      e,
      function (a) {
        !0 != cloudActionQueryStoped &&
          ((a = _cloudParseError(a[ERR_CODE])),
          !0 == a.result
            ? _cloudActionQueryStatus(
                cloudClientStatus.secName.modifyAccountPwd,
                !0
              )
            : (cloudParseHandle(cloudResultType.ACTION_ERROR, a),
              _setCloudHandle(null)));
      },
      !0
    );
  };
}
function CloudUpgradePush() {
  this.pageCloudPush = !0;
  this.gOnlineUpgradeNote = "";
  this.upgradeErrCBCloudPush = null;
  this.gOnlineUpgradeFail = !1;
  this.errHandleCloudPush = function (a) {
    switch (a) {
      case ENONE:
        return !0;
      case EFWNOTSUPPORTED:
      case EFILETOOBIG:
      case EFWEXCEPTION:
        gOnlineUpgradeNote = errStr.fwFmtErr;
        break;
      case EFWNOTINFLANDBL:
      case EFWNEWEST:
        gOnlineUpgradeNote = errStr.fwNotSupported;
        break;
      case EINVMEMORYOUT:
      case EINVDOWNLOADFWFAILED:
      case EINVSENDREQMSGFAILED:
      case EINVREQUESTTIMEOUT:
      case EINVCONNECTTINGCLOUDSERVER:
      case EINVLASTOPTIONISNOTFINISHED:
      case ESYSBUSY:
        gOnlineUpgradeNote = errStr.fwDownLoadFailed;
        break;
      case EINVDEVICEIDNOTEXIST:
      case EINVERRORDEVICEIDFORMATERROR:
      case EINVILLEGALDEVICE:
        gOnlineUpgradeNote = appendErrCode(errStr.cloudDeviceInfoExpt, a);
        break;
      case EINVCLOUDCLIENTGENERIC:
      case EINVCLOUDCLIENTDOWNLOADPARSEDNSREQUEST:
      case EINVCLOUDCLIENTDOWNLOADESTABLISHTCP:
      case EINVCLOUDCLIENTDOWNLOADHTTPNOTOK:
      case EINVCLOUDCLIENTDOWNLOADTIMEOUT:
        gOnlineUpgradeNote = appendErrCode(errStr.invNetworkErr, a);
        break;
      default:
        gOnlineUpgradeNote = errStr.fwUpgradeFailed;
    }
    return !1;
  };
  this.closeUpdateInfoLoading = function (a) {
    var b = id("UpgradeSoftConfitrm");
    void 0 != b && document.body.removeChild(b);
    hideCoverB();
    "function" == typeof a && a();
  };
  this.setUpgradeErrCBCloudPush = function (a) {
    this.upgradeErrCBCloudPush = a;
  };
  this.upgradeFailHdCloudPush = function () {
    "function" == typeof this.upgradeErrCBCloudPush &&
      (this.upgradeErrCBCloudPush(), (this.upgradeErrCBCloudPush = null));
  };
  this.checkOnlineUpgrading = function (a) {
    var b = cloudClientStatus.fileName,
      c = {};
    c[b] = {};
    c[b][KEY_NAME] = cloudClientStatus.secName.clientInfo;
    !0 == $.local
      ? a()
      : $.query(c, function (c) {
          ENONE == c[ERR_CODE]
            ? ((c = parseInt(
                c[b][cloudClientStatus.secName.clientInfo][
                  cloudClientStatus.optName.fwDownloadStatus
                ]
              )),
              uciCloudConfig.optValue.cloudDownloading == c
                ? onlineUpgradeProgress(SYSUPGRADE_SECONDS)
                : a())
            : a();
        });
  };
  this.onlineUpgradeProgress = function (a) {
    function b() {
      var e = {};
      e[c] = {};
      e[c][KEY_NAME] = cloudClientStatus.secName.clientInfo;
      $.query(
        e,
        function (e) {
          !0 == errHandleCloudPush(e[ERR_CODE])
            ? ((e = parseInt(
                e[c][cloudClientStatus.secName.clientInfo][
                  cloudClientStatus.optName.fwDownloadStatus
                ]
              )),
              uciCloudConfig.optValue.cloudDownloading == e
                ? $.setTimeout(b, d)
                : uciCloudConfig.optValue.cloudOutline == e
                ? ((gOnlineUpgradeNote = statusStr.fwDownLoadErr),
                  upgradeFailHdCloudPush())
                : uciCloudConfig.optValue.cloudComplete == e
                ? $.setTimeout(function () {
                    var a = window.location.href,
                      b = a.indexOf("?");
                    0 <= b && (a = a.substring(0, b));
                    $.setTimeout(function () {
                      lanDetecting(function () {
                        location.href = a;
                      });
                    }, LAN_DETECT_TIME);
                  }, a)
                : $.setTimeout(b, d))
            : ((gOnlineUpgradeNote = statusStr.fwDownLoadErr),
              upgradeFailHdCloudPush());
        },
        !0,
        !0
      );
    }
    var c = cloudClientStatus.fileName,
      d = 500;
    loadingDialog.show(
      {
        title: label.upgradeOnline,
        content: { primary: label.upgrading, secondary: label.upgradingTips },
      },
      void 0,
      void 0,
      !1,
      void 0
    );
    b();
  };
  this.checkFWVerSuccessCloudPush = function () {
    var a = uciCloudConfig.fileName,
      b = {};
    b[a] = {};
    b[a][uciCloudConfig.actionName.downloadFw] = null;
    $.action(
      b,
      function (a) {
        !0 == errHandleCloudPush(a[ERR_CODE])
          ? ((a = a.wait_time
              ? 1e3 * parseInt(a.wait_time)
              : SYSUPGRADE_SECONDS),
            onlineUpgradeProgress(a))
          : upgradeFailHdCloudPush();
      },
      void 0,
      !0
    );
  };
  this.onlineUpgradeCheck = function (a, b, c) {
    function d() {
      var e = {};
      e[f] = {};
      e[f][KEY_NAME] = cloudClientStatus.secName.checkFwVer;
      $.query(
        e,
        function (e) {
          if (!0 == a(e[ERR_CODE]))
            switch (
              parseInt(
                e[f][cloudClientStatus.secName.checkFwVer][
                  cloudClientStatus.optName.actionStatus
                ]
              )
            ) {
              case 0:
              case 5:
                "function" == typeof b &&
                  b(
                    e[f][cloudClientStatus.secName.checkFwVer][
                      cloudClientStatus.optName.errCode
                    ]
                  );
                break;
              case 4:
                "function" == typeof c && c();
                break;
              default:
                $.setTimeout(d, 500);
            }
          else "function" == typeof b && b();
        },
        void 0,
        !0
      );
    }
    var e = uciCloudConfig.fileName,
      f = cloudClientStatus.fileName,
      g = {};
    g[e] = {};
    g[e][uciCloudConfig.actionName.checkFwVersion] = null;
    $.action(
      g,
      function (b) {
        !0 == a(b[ERR_CODE]) && d();
      },
      void 0,
      !0
    );
  };
  this.onlineUpgrade = function (a, b) {
    this.upgradeErrCBCloudPush = a;
    this.gOnlineUpgradeNote = "";
    this.onlineUpgradeCheck(
      errHandleCloudPush,
      function () {
        gOnlineUpgradeNote = statusStr.fwDownLoadErr;
        upgradeFailHdCloudPush();
      },
      function () {
        "function" == typeof b &&
          b(function () {
            checkFWVerSuccessCloudPush();
          });
      }
    );
  };
}
function Phone() {
  this.OS = {
    windows: !1,
    windowsPhone: !1,
    unixPC: !1,
    iPad: !1,
    iPhone: !1,
    iMacPC: !1,
    iPod: !1,
    android: !1,
    nokia: !1,
    player: !1,
    Android_UC: !1,
    portable: !1,
    checkDeviceMode: function () {
      var a = navigator.platform,
        b = navigator.userAgent;
      if (void 0 != a)
        if (0 <= a.indexOf("Win"))
          0 <= b.indexOf("Windows Phone")
            ? (this.portable = this.windows = this.windowsPhone = !0)
            : ((this.windows = !0), (this.portable = !1));
        else if (0 <= b.indexOf("NOKIA")) this.portable = this.nokia = !0;
        else if (0 <= b.indexOf("Android")) this.portable = this.android = !0;
        else if (0 <= a.indexOf("iPad")) this.portable = this.iPad = !0;
        else if (0 <= a.indexOf("iPhone")) this.portable = this.iPhone = !0;
        else if (0 <= a.indexOf("iPod")) this.portable = this.iPod = !0;
        else if (0 <= b.indexOf("Wii") || 0 <= b.indexOf("PLASTATION"))
          this.portable = this.player = !0;
        else if (0 <= a.indexOf("Mac"))
          (this.iMacPC = !0), (this.portable = !1);
        else {
          if (
            0 <= a.indexOf("X11") ||
            (0 <= a.indexOf("Linux") && 0 > a.indexOf("arm"))
          )
            (this.unixPC = !0), (this.portable = !1);
        }
      else
        0 <= b.indexOf("Android")
          ? (this.portable = this.android = !0)
          : (this.portable =
              1024 <= document.body.clientWidth ||
              1024 <= document.body.clientHeight
                ? !1
                : !0);
    },
  };
  this.phoneSet = { bContinuePCSet: !1, bPhoneWizardSet: !1 };
  OS.checkDeviceMode();
}
function Slp() {
  this.cloneObj = function (a) {
    var b = {};
    if ("object" != typeof a) return a;
    a.constructor == Array && (b = []);
    for (var c in a) b[c] = cloneObj(a[c]);
    return b;
  };
  this.hideLeadingZeros = function (a) {
    return a.replace(/0*(\d+)/g, "$1");
  };
  this.getUTF8StrLen = function (a) {
    a = escape(a);
    for (var b = 0, c = 0; c < a.length; c++)
      "%" == a.charAt(c)
        ? "u" == a.charAt(c + 1)
          ? ((b = 2048 > parseInt(a.substr(c + 2, 4), 16) ? b + 2 : b + 3),
            (c += 5))
          : (b++, (c += 2))
        : b++;
    return b;
  };
  this.calcNextIndex = function (a, b) {
    if (null == a || !(a instanceof Array)) return -1;
    var c = [],
      d;
    for (d in a) {
      var e = a[d][SEC_NAME];
      "undefined" != typeof e &&
        "string" == typeof e &&
        ((e = e.replace(/^.*_(\d+)$/g, "$1")), (c[e] = !0));
    }
    e = c.length;
    if (!/\D/g.test(b) && b >= e) return b;
    for (d = /\D/g.test(b) ? 1 : b; d <= e; d++)
      if ("undefined" == typeof c[d]) return d;
    return e + 1;
  };
  this.formatTableData = function (a) {
    var b = [];
    if (null == a || !(a instanceof Array)) return b;
    for (var c in a) {
      var d = a[c],
        e;
      for (e in d) (d[e][SEC_NAME] = e), (b[c] = d[e]);
    }
    return b;
  };
}
function MacFactoryFun() {
  this.getMacBrandObj = function (a) {
    for (
      var b = MacFactoryArr.length,
        c = null,
        d = a.mac.substring(0, 8).toUpperCase().replace(/:/g, "-"),
        e = 0;
      e < b - 1;
      e++
    )
      if (
        ((a = MacBrands[MacFactoryArr[e].name]),
        void 0 != a && 0 <= a.indexOf(d))
      ) {
        c = MacFactoryArr[e];
        break;
      }
    return c;
  };
  this.macBrandTransition = function (a) {
    var b = getMacBrandObj(a),
      c = MacFactoryArr.length;
    null != b
      ? ((a.logoPosX = b.posX), (a.logoPosY = b.posY))
      : a.type == uciHostsInfo.optValue.linkType.wired
      ? ((a.logoPosX = MacFactoryArr[c - 2].posX),
        (a.logoPosY = MacFactoryArr[c - 2].posY))
      : ((a.logoPosX = MacFactoryArr[c - 3].posX),
        (a.logoPosY = MacFactoryArr[c - 3].posY));
  };
  this.getBrandName = function (a, b) {
    var c = getMacBrandObj(a);
    return null != c ? (void 0 != c[b] ? c[b] : "-") : "-";
  };
}
(function () {
  Phone.call(window);
  Tool.call(window);
  PageFunc.call(window);
  Cover.call(window);
  Explorer.call(window);
  LocalStorageSD.call(window);
  ShowTips.call(window);
  Select.call(window);
  Tips.call(window);
  LanDetect.call(window);
  Help.call(window);
  Slp.call(window);
  MacFactoryFun.call(window);
  CloudUpgradePush.call(window);
  CloudAction.call(window);
  CloudCommon.call(window);
})();
