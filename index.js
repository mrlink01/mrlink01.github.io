'use strict';

const init = () => {
    const theScene = new Scene($('#main'));
    const player = new MainCharacter($('#player'), '80%', 0);
    const scoreCounter = new ScoreCounter($('#score'), $('#stoneCounter'));

    const jumpHeight = $('#jumpHeight').val();
    const startStones = $('#startScore').val();

    scoreCounter.stones = startStones;

    // Clicking the scene jumps
    theScene._$scene.click(_ => { player.jump(jumpHeight) });
    $(window).keyup((e) => {
        // Space can jump as well
        if(e.keyCode == 32){
            player.jump(jumpHeight);
        }
     });

    // Function to create a character adn add it to the scene
    const createCharacter = _ => {
        const charClasses = [
            'cap',
            'thor',
            'star',
            'gam',
        ];

        const curSprite = charClasses[Math.floor(Math.random()*charClasses.length)];

        const cur = $('<div>', {
            class: `character obs ${curSprite}`,
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
            clearAllIntervals();
            endGame([], $('#lose'));
        }

        cur.x = `${++pos}%`;

        if (pos > 100) {
            pos = 0;
            cur = new Character(createCharacter());
        }
    }, 1 * 30);

    const scoreTimer = setInterval(_ => {
        scoreCounter.incrementScore(1);
    }, 1 * 100);

    const sceneTimer = setInterval(_ => {
        scoreCounter.incrementStones();

        if (scoreCounter.checkWin()) {
            clearAllIntervals();
            $('#win').modal('show');
        }
    }, 10 * 1000);

    $('#snap').click(_ => {
        theScene.hide();
    });

    var clearAllIntervals = _ => {
        clearInterval(sceneTimer);
        clearInterval(scoreTimer);
        clearInterval(characterTimer);
    }
};

function endGame(intervals, loseModal) {
    intervals.forEach(i => {
        clearInterval(i);
    });

    loseModal.modal('show');
}

/**
 * Class to encapsulate the score and score dom element
 */
class ScoreCounter {
    #score = 0;
    #stones = 1;

    /**
     * Constructor
     * 
     * @param {object} $counter jQuery object for the score counter
     */
    constructor($counter, $stoneCounter) {
        this._$counter = $counter;
        this._$stoneCounter = $stoneCounter;
    }

    set score(score) {
        this.#score = score;

        this._$counter.text(this.#score);
    }

    set stones(stones) {
        this.#stones = stones;

        this._$stoneCounter.text(`Stones: ${this.#stones}/6`);
    }

    incrementStones() {
        if (this.#stones >= 6) return;

        this.#stones++;

        this._$stoneCounter.text(`Stones: ${this.#stones}/6`);
    }

    incrementScore(scoreToAdd) {
        this.score = this.#score + scoreToAdd;
    }

    checkWin() {
        return this.#stones >= 6;
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
            rect1.left  > rect2.right || 
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

    jump(maxheight=420) {
        if (Boolean(this.#jumpTimer)) return;
        let incAmnt = 2;
        let cnt = 0;
        let indx = 0;
        let apex = maxheight / 2; 
        let maxJump = false;

        this.#jumpTimer = setInterval(_ => {
            if (!maxJump && cnt >= apex) {
                maxJump = true;
            } 
            
            if (maxJump) {
                incAmnt = 1;
                cnt-=incAmnt;
            } else {
                cnt+=incAmnt;
            }

            this.y = cnt;

            indx+=incAmnt;

            if (indx >= maxheight) {
                this.y = 0;
                clearInterval(this.#jumpTimer); 
                this.#jumpTimer = undefined;
            }
        }, .1);
    }

}

let started = false;

$('#main').click((e) => {
    if (started) return; 

    started = true;
    init();
});
