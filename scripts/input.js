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
            keys[e.key]?.oldPress = true;
            keys[e.key] = e.timeStamp;
        }
        
        function keyRelease(e) {
            delete keys[e.key];
        }
        
        RegisterCommand = function(keys, handler) {
            for (let key in keys) {
                handlers[key] = handler();
            };
        };

        RegisterGroupCommands = function(keys, handler, spec) {
            let groupHandle = handler(spec);
            for (let key in keys) {
                handlers[key] = groupHandle.handle();
            };
        };

        Update = function(elapsedTime) {
            for (let key in keys) {
                handlers[key](elapsedTime);
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

    Handlers = function() {

        CharacterMovement = function(spec) {
            Handel = function(elapsedTime) {
            }
            return  {
                Handel : Handel,
            };
        }

        return {
            CharacterMovement : CharacterMovement,
        };
    }
};
