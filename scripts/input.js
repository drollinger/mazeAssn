/**************************************************
 * Name: Dallin Drollinger
 * A#: A01984170
 * Description: 
 *************************************************/
'use strict';

let Input = function() {
    Keyboard = function() {
        let keys = {};
        let handlers = {};
        
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
        
        let RegisterCommand = function(keyList, handler) {
            for (let key of keyList) {
                handlers[key] = handler;
            };
        };

        let RegisterGroupCommands = function(keyList, handler, spec) {
            let groupHandle = handler(spec);
            for (let key of keyList) {
                handlers[key] = groupHandle.handle;
            };
        };

        let Update = function(elapsedTime) {
            for (let key in keys) {
                handlers[key]?.(keys[key], elapsedTime);
                keys[key].heldPress = true;
            }
        };

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
