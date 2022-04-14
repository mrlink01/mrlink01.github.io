'use strict';

const init = () => {
    
    // Load an array with each scene
    const scenes = [...Array(5).keys()].map((elem) => 
        `scene${++elem}`
    );

    const theScene = new Scene($('#main'));
    const player = new MainCharacter($('#player'), '80%', 0);
    const scoreCounter = new ScoreCounter($('#score'));

    theScene._$scene.click(_ => { player.jump() });
    $(window).keyup((e) => {
        
        if(e.keyCode == 32){
            player.jump();
        }
     });

    // Function to create a character adn add it to the scene
    const createCharacter = _ => {
        const cur = $('<div>', {
            class: 'character test',
        });
        
        cur.appendTo('#main');

        return cur;
    };

    let indx = 0;
    let pos = 0;

    let cur = new Character(createCharacter());

    const characterTimer = setInterval(_ => {

        const overlaps = player.checkCollision(cur);

        if (overlaps) {
            clearInterval(characterTimer);
        }

        cur.x = `${++pos}%`;

        if (pos > 100) {
            pos = 0;
            cur = new Character(createCharacter());
        }
    }, 1 * 50);

    const scoreTimer = setInterval(_ => {
        scoreCounter.incrementScore(1);
    }, 1 * 100);

    const sceneTimer = setInterval(_ => {
        theScene.swapScene(scenes[indx], scenes[++indx]);

        if (indx >= scenes.length) {
            clearInterval(sceneTimer);
            clearInterval(scoreTimer);
            theScene.hide();
        };
    }, 10 * 1000);
};

/**
 * Class to encapsulate the score and score dom element
 */
class ScoreCounter {
    #score = 0;

    /**
     * Constructor
     * 
     * @param {object} $counter jQuery object for the score counter
     */
    constructor($counter) {
        this._$counter = $counter;
    }

    set score(score) {
        this.#score = score;

        this._$counter.text(this.#score);
    }

    incrementScore(scoreToAdd) {
        this.score = this.#score + scoreToAdd;
    }
}

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
    swapScene(from, to,) {
        this._$scene.removeClass(from);
        this._$scene.addClass(to);
    }

    /**
     * Hide the scene
     *  Initiated by a snap
     */
    hide() {
        this._$scene.hide('slow');
    }
}

/**
 * Class to encapsulate the character, its position, and the dom element
 */
class Character {
    
    #x;
    #y;

    /**
     * 
     * @param {object} $elem jQuery object representing the current character
     * @param {*} x X-location
     * @param {*} y Y-location
     */
    constructor($elem, x, y,) {
        this._$elem = $elem;
        this.x = x ?? this._$elem.position().right;
        this.y = y ?? this._$elem.position().bottom; 
    }

    set y(y) {
        this.#y = y;

        const attr = (typeof y === 'string' || y instanceof String) ? y : `${y}px`;

        this._$elem.css('bottom', attr);
    }

    set x(x) {
        this.#x = x;

        const attr = (typeof x === 'string' || x instanceof String) ? x : `${x}px`;

        this._$elem.css('right', attr);
    }

    /**
     * Method to check whether there is a collision
     * 
     * @param {object} otherCharacter Another character to check collision against.
     * @returns {boolean} Whether or not there is a collision
     */
    checkCollision(otherCharacter) {
        const rect1 = this._$elem[0].getBoundingClientRect()
        const rect2 = otherCharacter._$elem[0].getBoundingClientRect();

        const overlap = !(rect1.right < rect2.left || 
            rect1.left > rect2.right || 
            rect1.bottom < rect2.top || 
            rect1.top > rect2.bottom);
        
        console.log(overlap);

        return overlap;
    }
}

/**
 * Extension of Character
 *  Ability to jump
 */
class MainCharacter extends Character {
    #jumpTimer;

    constructor($elem, x, y,)  {
        super($elem, x, y);
    }

    jump(maxheight=240) {
        if (Boolean(this.#jumpTimer)) return;

        let cnt = 0;
        let indx = 0;
        let apex = maxheight / 2; 
        let maxJump = false;

        this.#jumpTimer = setInterval(_ => {
            if (!maxJump && cnt >= apex) {
                maxJump = true;
            } 
            
            if (maxJump) {
                this.y = --cnt;
            } else {
                this.y = ++cnt;
            }

            indx++;

            if (indx >= maxheight) {
                clearInterval(this.#jumpTimer); 
                this.#jumpTimer = undefined;
            }
        }, .1);
    }

}

init();
