'use strict';

const init = () => {
    
    // Load an array with each scene
    const scenes = [...Array(5).keys()].map((elem) => 
        `scene${++elem}`
    );

    const theScene = new Scene($('#main'));

    let indx = 0;

    const sceneTimer = setInterval(() => {
        theScene.swapScene(scenes[indx], scenes[++indx]);


        if (indx >= scenes.length) {
            clearInterval(sceneTimer)
            theScene.hide();
        };
    }, 3 * 1000);
};

/**
 * Scene class to encapsulate game background 
 */
class Scene {

    /**
     * Constructor
     * 
     * @param {object} $scene jQuery object representing the background scene
     */
    constructor($scene) {
        this._$scene = $scene;
    }

    /**
     * Swaps scene bacground from one scene to another 
     * 
     * @param {string} from Class to swap from
     * @param {string} to Class to swap to
     */
    swapScene(from, to) {
        this._$scene.removeClass(from);
        this._$scene.addClass(to);
    }

    hide() {
        this._$scene.hide('slow');
    }
}

init();