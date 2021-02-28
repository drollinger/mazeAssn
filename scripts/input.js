/**************************************************
 * Name: Dallin Drollinger
 * A#: A01984170
 * Description: Our input processing adapted from
 *   provided code. The main update function is
 *   what calls registered functions
 *************************************************/
'use strict';

let Input = function() {
    Keyboard = function() {
        let keys = {};
        let handlers = {};
        
        let RegisterCommand = function(keyList, handler) {
            for (let key of keyList) {
                handlers[key] = handler;
            };
        };

        let Update = function(elapsedTime) {
            for (let key in keys) {
                handlers[key]?.(keys[key], elapsedTime);
                keys[key].heldPress = true;
            }
        };

        function keyPress(e) {
            if (!keys[e.key]) {
                keys[e.key] = {};
                keys[e.key].heldPress = false;
            }
            keys[e.key].timeStamp = e.timeStamp;
        }
        
        function keyRelease(e) {
            delete keys[e.key];
        }

        window.addEventListener('keydown', keyPress);
        window.addEventListener('keyup', keyRelease);
        
        return {
            handlers : handlers,
            keys : keys,
            RegisterCommand : RegisterCommand,
            Update : Update,
        };
    }

    return {
        Keyboard : Keyboard
    };
};
