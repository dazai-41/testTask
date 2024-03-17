function initializeSlider(options) {
    const {
        containerId,
        itemClass,
        prevBtnClass,
        nextBtnClass,
        autoScroll = false,
        minItems = 3,
        scrollInterval = 414,
        enableCircles = true,
        enableCounter = true
    } = options;

    const scroller = document.getElementById(containerId),
    scrollerParent = scroller.parentNode,
    itemLength = scroller.querySelectorAll(`${itemClass}`).length;

    
    let counterItem;
    let i = 3;
    let minI = minItems;
    let dots = [];

    if (window.innerWidth <= 1025) {
        i = 2;
        minI = 2;
    }
    if (window.innerWidth <= 431) {
        i = 1;
        minI = 1;
    }

    if(enableCounter){
        const counter = scrollerParent.querySelector('.counter');

        counter.style.display = enableCounter ? 'flex' : 'none';
        counter.innerHTML = `<div class='item'>${i}</div><span>&nbsp;/&nbsp;${itemLength}</span>`;
        counterItem = counter.querySelector('.item');
    }

    let lastClickTime = 0;
    let autoScrollInterval;

    const prevBtn = scrollerParent.querySelector(` ${prevBtnClass}`);
    const nextBtn = scrollerParent.querySelector(`${nextBtnClass}`);

    if (prevBtn && nextBtn && scroller) {
        prevBtn.addEventListener("click", () => {
            const currentTime = new Date().getTime();
            if (currentTime - lastClickTime > 300) {
                scroller.scrollBy(-scrollInterval, 0);
                if (i > minI) {
                    i--;
                    if (enableCounter && counterItem) {
                        counterItem.innerHTML = i;
                    }
                    if (enableCircles) {
                        updateDots();
                    }
                }
            }
            lastClickTime = currentTime;
        });

        nextBtn.addEventListener("click", () => {
            const currentTime = new Date().getTime();
            if (currentTime - lastClickTime > 300) {
                scroller.scrollBy(scrollInterval, 0);
                if (i < itemLength) {
                    i++;
                    if (enableCounter && counterItem) {
                        counterItem.innerHTML = i;
                    }
                    if (enableCircles) {
                        updateDots();
                    }
                }
            }
            lastClickTime = currentTime;
        });

        scroller.addEventListener('scroll', () => {
            const scrollLeft = scroller.scrollLeft;
            const scrollWidth = scroller.scrollWidth;
            const clientWidth = scroller.clientWidth;
            if (scrollLeft === 0) {
                prevBtn.setAttribute('disabled', true);
            } else {
                prevBtn.removeAttribute('disabled');
            }
            if (scrollLeft + clientWidth >= scrollWidth - 1) {
                nextBtn.setAttribute('disabled', true);
            } else {
                nextBtn.removeAttribute('disabled');
            }
        });

        if (autoScroll) {
            autoScrollInterval = setInterval(() => {
                if (i < itemLength) {
                    i++;
                    if (enableCounter && counterItem) {
                        counterItem.innerHTML = i;
                    }
                    scroller.scrollBy(scrollInterval, 0);
                }
            }, 4000);
        }

        function updateDots() {
            if (dots.length > 0) {
                dots.forEach((dot) => {
                    dot.classList.remove('isActive');
                });
        
                if (dots[i - 1]) {
                    dots[i - 1].classList.add('isActive');
                }
            }
        }

        function updateSlider() {
            // Обновление активных точек
            dots.forEach((dot, index) => {
                if (index === i - 1) {
                    dot.classList.add('isActive');
                } else {
                    dot.classList.remove('isActive');
                }
            });

            if (enableCounter) {
                // Обновление счетчика, только если enableCounter установлен в true
                counterItem.innerHTML = i;
            }
        }

        if (enableCircles) {
            const dotsContainer = scrollerParent.querySelector('.dots');

            // Создаем dots для максимального количества переключений слайдов
            for (let j = 0; j < itemLength; j++) {
                const dot = document.createElement('div');
                dot.classList.add('dot');
                dotsContainer.appendChild(dot);
            }
        
            dots = Array.from(dotsContainer.children);
    
            dots.forEach((dot, index) => {
                dot.addEventListener('click', () => {
                    i = index + 1;
                    updateSlider();
                    updateDots(); // Обновление активного круга при нажатии на точку

                    scroller.scrollLeft = scrollInterval * (i - 1);
                });
            });
    
            updateSlider(); // Установка активной точки при инициализации
        }
    }

    return {
        stopAutoScroll: () => {
            clearInterval(autoScrollInterval);
        },
        startAutoScroll: () => {
            autoScrollInterval = setInterval(() => {
                if (i < itemLength) {
                    i++;
                    counterItem.innerHTML = i;
                    scroller.scrollBy(scrollInterval, 0);
                }
            }, 4000);
        }
    };
}


window.onload = function () {
    const slider1 = initializeSlider({
        containerId: "scroller",
        itemClass: ".item-wrapp",
        prevBtnClass: ".prevBtn",
        nextBtnClass: ".nextBtn",
        autoScroll: true,
        minItems: 3,
        scrollInterval: 355,
        enableCircles: false,
        enableCounter: true
    });

    const slider2 = initializeSlider({
        containerId: "scroller2",
        itemClass: ".item-wrapp",
        prevBtnClass: ".prevBtn",
        nextBtnClass: ".nextBtn",
        autoScroll: false,
        minItems: 1,
        scrollInterval: 355,
        enableCircles: true,
        enableCounter: false
    });
};