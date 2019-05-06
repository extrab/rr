/*:
 *
 * @plugindesc 게임을 렌더링하는 캔버스의 DOM을 가져와 css translate를 통해 화면을 흔들리게 하는 스크립트입니다.
 * @author Creta Park (Park Jong-Hyeok) (creta5164@gmail.com, http://creffect.com/?me=cretapark)
 * 
 * @param 흔들림_강도.가볍게
 * @desc '흔들림_강도.가볍게'의 흔들림의 기본값을 정합니다.
 * @default 2.5,45,0
 *
 * @param 흔들림_강도.일반
 * @desc '흔들림_강도.일반'의 흔들림의 기본값을 정합니다.
 * @default 7.5,30,0
 *
 * @param 흔들림_강도.임팩트
 * @desc '흔들림_강도.임팩트'의 흔들림의 기본값을 정합니다.
 * @default 10,15,0
 * 
 * @param 흔들림_스타일
 * @desc 흔들리는 스타일의 기본값을 화면 떨림으로 할 지, 좌 우로 흔들기로 할 지를 정합니다. (shake/radialShake)
 * @default shake
 * 
 * @help
 * Shaker 플러그인
 * ----------------------------------------------------------------------------
 * 이 플러그인은 쯔구르의 화면이 흔들리는 이벤트를 진짜 화면이 흔들리게 바꿔주는 플러그인 입니다.
 * 소스코드는 어떠한 경우에도 거의 자유인 MIT 라이센스를 사용합니다.
 * License : MIT
 * 
 * 사용법
 * ----------------------------------------------------------------------------
 * 기본 이벤트인 흔들림 이벤트를 사용하기 때문에 코드를 사용할 일은 없지만, "세세한 값을 조정해서 흔들림을 발생하고 싶다"면 아래의 코드를 이용해주세요.
 * 스크립트를 만들어 안에 넣으면 됩니다 : 
 * 
 * Shaker.shake(강도 (px, 10을 곱해서 계산됨.), 프레임 갱신 빈도, 시간 (1초 = 60))
 *   화면을 흔듭니다.
 *   사용법 : Shaker.shake(10, 0, 60);  // => 100, 0, 60
 * 
 * Shaker.shake(흔들림_강도 -> 가볍게, 일반, 임팩트)
 *   화면을 흔듭니다. (템플릿을 기반으로 함)
 *   사용법 : Shaker.shake(흔들림_강도.임팩트);
 * 
 * 
 * Shaker.radialShake(강도 (degree 단위), 프레임 갱신 빈도, 시간 (1초 = 60))
 *   화면을 좌우로 기울여 흔듭니다.
 *   사용법 : Shaker.radialShake(10, 0, 60);
 * 
 * Shaker.radialShake(흔들림_강도 -> 가볍게, 일반, 임팩트)
 *   화면을 흔듭니다. (템플릿을 기반으로 함)
 *   사용법 : Shaker.radialShake(흔들림_강도.임팩트);
 * 
 * Shaker.stop()
 *   흔들림을 중단합니다.
 *   (사용법 x) 활용법 1 - 지속적인 흔들림일 때 :
 *   //지진이다!
 *   Shaker.shake(10, 0, 9999999);
 *   대사] 아니, 지금 무너지게 생겼는데?
 *         어서 여기를 빠져나가야 돼!
 *   //...
 * 
 *   Shake.stop();
 *   
 *   대사] 휴... 겨우 탈출했어.
 * 
 *   (사용법 x) 활용법 2 - 줄어드는 흔들림이 아닌 일시적으로 유지되는 흔들림 :
 *   //괴물이 크게 울부짖음
 *   Shaker.shake(20, 0, 600);
 *   효과음] ...
 *   대기] 60
 *   Shaker.stop();
 */

var Shaker;

(function() {
const 흔들림_강도 = {
    가볍게:"low",
    일반:  "normal",
    임팩트:"high"
};

var Shaker_template = {
    "low": {
        "amount":   parseFloat(PluginManager.parameters('Shaker')["흔들림_강도.가볍게"].split(',')[0]),
        "duration": parseFloat(PluginManager.parameters('Shaker')["흔들림_강도.가볍게"].split(',')[1]),
        "speed":    parseFloat(PluginManager.parameters('Shaker')["흔들림_강도.가볍게"].split(',')[2])
    },
    "normal": {
        "amount":   parseFloat(PluginManager.parameters('Shaker')["흔들림_강도.일반"].split(',')[0]),
        "duration": parseFloat(PluginManager.parameters('Shaker')["흔들림_강도.일반"].split(',')[1]),
        "speed":    parseFloat(PluginManager.parameters('Shaker')["흔들림_강도.일반"].split(',')[2])
    },
    "high": {
        "amount":   parseFloat(PluginManager.parameters('Shaker')["흔들림_강도.임팩트"].split(',')[0]),
        "duration": parseFloat(PluginManager.parameters('Shaker')["흔들림_강도.임팩트"].split(',')[1]),
        "speed":    parseFloat(PluginManager.parameters('Shaker')["흔들림_강도.임팩트"].split(',')[2])
    }
};

var Shaker_style = PluginManager.parameters('Shaker')["흔들림_스타일"];

var Shaker_totalDuration;
var Shaker_current;
var Shaker_context;

Shaker = {
    "stop": function() {
        if (Shaker_context != null)
            Shaker_context.style.transform = "none";

        document.body.style.overflow = "";

        if (Shaker_current != null)
            clearInterval(Shaker_current);
        
        Shaker_current = null;
        Shaker_context = null;
    },

    "shake": function(amount, speed, duration, target)
    {
        if (amount === null   || amount === undefined)
            amount = 흔들림_강도.일반;
        if (speed === null    || speed === undefined)
            speed = 0;
        if (duration === null || duration === undefined)
            duration = 45;

        var temp = amount;
        if (typeof temp === "string" && temp in Shaker_template) {
            amount   = Shaker_template[temp].amount;
            duration = Shaker_template[temp].duration;
            speed    = Shaker_template[temp].speed;
        }
    
        if (target == null) {
            //초기화
            if (Shaker_current != null)
                clearInterval(Shaker_current);
    
            Shaker_totalDuration = duration;
    
            Shaker.shake(amount * 10, speed, duration, document.getElementById("GameCanvas"));
    
            document.body.style.overflow = "hidden";
        } else {
            Shaker_context = target;

            if (duration <= 0) {
                Shaker_current = null;
                Shaker_context = null;
                target.style.transform = "none";
                document.body.style.overflow = "";
                return;
            }
            
            var range = lerp(0, amount, duration / Shaker_totalDuration);
            var min = -range / 2;
    
            var axisX = min + Math.random() * range;
            var axisY = min + Math.random() * range;
            
            if (speed == 0 || duration % speed == 0)
                target.style.transform = "translate(" + axisX + "px, " + axisY + "px)";
    
            Shaker_current = setTimeout(Shaker.shake, 1000 / 60, amount, speed, --duration, target);
        }
    },

    "radialShake": function(amount, speed, duration, target)
    {
        if (amount === null   || amount === undefined)
            amount = 흔들림_강도.일반;
        if (speed === null    || speed === undefined)
            speed = 0;
        if (duration === null || duration === undefined)
            duration = 45;
        
        var temp = amount;
        if (typeof temp === "string" && temp in Shaker_template) {
            amount   = Shaker_template[temp].amount;
            duration = Shaker_template[temp].duration;
            speed    = Shaker_template[temp].speed;
        }
    
        if (target == null) {
            //초기화
            if (Shaker_current != null)
                clearInterval(Shaker_current);
    
            Shaker_totalDuration = duration;
    
            radialShake(amount, speed, duration, document.getElementById("GameCanvas"));
    
            document.body.style.overflow = "hidden";
        } else {
            Shaker_context = target;
            
            if (duration <= 0) {
                Shaker_current = null;
                Shaker_context = null;
                target.style.transform = "none";
                document.body.style.overflow = "";
                return;
            }
            
            var range = lerp(0, amount, duration / Shaker_totalDuration);
    
            var axisX = range * (duration % 2 == 0 ? -1 : 1);
            
            if (speed == 0 || duration % speed == 0)
                target.style.transform = "rotate(" + axisX + "deg)";
    
            Shaker_current = setTimeout(radialShake, 1000 / 60, amount, speed, --duration, target);
        }
    }
}

function lerp(a, b, c) { return a + c * (b - a); }

Game_Screen.prototype.startShake = function(power, speed, duration) {
    if (Shaker_style in Shaker)
        Shaker[Shaker_style](power, 0, duration);
    else
        Shaker.shake(power, 0, duration);
};

Game_Screen.prototype.updateShake = function() {};

})();