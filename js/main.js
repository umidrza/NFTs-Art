document.addEventListener('DOMContentLoaded', function () {
    const navMenuButton = document.querySelector("#nav-menu-icon");
    const navMenuIcons = navMenuButton.querySelectorAll('hr');
    const navMenu = document.querySelector(".nav-links");
    const toggleButton = document.getElementById('theme-toggle');
    const toggleButtonIcon = toggleButton.querySelector('i');

    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.documentElement.setAttribute('data-theme', savedTheme);
        toggleButtonIcon.classList.toggle('fa-moon');
        toggleButtonIcon.classList.toggle('fa-circle-half-stroke');
    }

    navMenuButton.addEventListener("click", () => {
        navMenu.classList.toggle("active");
        document.querySelector("main").classList.toggle("blur");
        document.querySelector("footer").classList.toggle("blur");
        navMenuIcons.forEach((hr, key) => hr.classList.toggle(`rotated-hr${key + 1}`));
    });

    toggleButton.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        toggleButtonIcon.classList.toggle('fa-moon');
        toggleButtonIcon.classList.toggle('fa-circle-half-stroke');
    });

    
    let ethToUsdRate = 3497.43;
    fetch('https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd')
        .then(res => res.json())
        .then(data => ethToUsdRate = data.ethereum.usd)
        .catch(error => console.error("cannot fetch eth to usd api" + error));

    function convertEthToUsd(ethAmount) {
        return ethAmount * ethToUsdRate;
    }

    function truncateText(text, length) {
        return text.length > length ? text.slice(0, length) + '...' : text;
    }

    document.querySelectorAll('.auto-scroll').forEach((scrollbar, key) => {
        let maxScrollWidth = scrollbar.scrollWidth - scrollbar.clientWidth;
        scrollbar.scrollLeft = key % 2 == 0 ? 0 : maxScrollWidth;
        let direction = 1;
        let pause = false;

        setInterval(() => {
            if (!pause) {
                scrollbar.scrollBy(direction, 0);

                if (scrollbar.scrollLeft >= maxScrollWidth) {
                    direction = -1;
                    pause = true;
                    setTimeout(() => { pause = false; }, 1000);
                }
                else if (scrollbar.scrollLeft <= 0) {
                    direction = 1;
                    pause = true;
                    setTimeout(() => { pause = false; }, 1000);
                }
            }
        }, 30)
    });

    document.querySelectorAll('.dropdown').forEach(dropdown => {
        const dropdownContent = dropdown.querySelector('.dropdown-content');
        const dropdownButton = dropdown.querySelector('.dropdown-btn');
        const dropdownIcon = dropdownButton.querySelector('.arrow-icon');

        let toggle = !dropdownContent.classList.contains('opened');
        dropdownIcon.style.transform = `rotate(${toggle ? 0 : 180}deg)`;
        dropdownContent.style.height = toggle ? "0px" : dropdownContent.scrollHeight + "px";

        dropdownButton.addEventListener('click', () => {
            toggle = dropdownContent.style.height !== "0px";
            dropdownIcon.style.transform = `rotate(${toggle ? 0 : 180}deg)`;
            dropdownContent.style.height = toggle ? "0px" : dropdownContent.scrollHeight + "px";
        });
    });

    document.querySelectorAll('.show-more').forEach(moreButton => {
        const textElement = moreButton.parentElement.querySelector('.extra-content');
        const fullText = textElement.innerHTML;
        textElement.innerHTML = truncateText(fullText, 300);

        moreButton.addEventListener('click', () => {
            if (moreButton.textContent == 'Show more') {
                textElement.innerHTML = fullText;
                moreButton.textContent = 'Show less';
            }
            else {
                textElement.innerHTML = truncateText(fullText, 300);
                moreButton.textContent = 'Show more';
            }
        });
    });

    document.querySelectorAll('.like-btn').forEach(likeBtn => {
        likeBtn.addEventListener('click', () => {
            likeBtn.classList.toggle('fa-regular');
            likeBtn.classList.toggle('fa-solid');
        })
    });

    document.querySelectorAll('.term-check-icon').forEach(checkBox => {
        const checkIcon = checkBox.querySelector('.check-icon');

        checkBox.addEventListener('click', () => {
            checkIcon.classList.toggle('hidden');
            let isChecked = !checkIcon.classList.contains('hidden');

            document.querySelectorAll('.auction-button').forEach(auctionBtn => {
                auctionBtn.disabled = !isChecked;
            });
        });
    });

    document.querySelectorAll('.eth').forEach(eth => {
        const usd = eth.parentElement.querySelector('.usd');
        const usdAmount = convertEthToUsd(parseFloat(eth.textContent));
        usd.textContent = `$${usdAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    });

    if (document.getElementById('nft-create-form')) {
        const imageInput = document.getElementById('upload-image-input');
        imageInput.addEventListener('change', (event) => {
            const file = event.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function (e) {
                    const imgElement = document.getElementById('uploaded-image');
                    imgElement.src = e.target.result;
                    imgElement.classList.remove('hidden');
                    document.getElementById('no-new-image').classList.add('hidden');
                };
                reader.readAsDataURL(file);
            }
        });
    }

    if (document.getElementById('nft-sell-form')) {
        const priceInput = document.getElementById('price-input');
        const currencySelect = document.getElementById('currency');
        const priceDisplay = document.getElementById('price-display');
        const scheduleSelect = document.getElementById('schedule-time');
        const startTimeInput = document.getElementById('start-time');
        const endTimeInput = document.getElementById('end-time');
        const popupEndTime = document.getElementById('popup-end-time');
        const popupPrice = document.getElementById('popup-price');

        const today = new Date().toISOString().split('T')[0];
        startTimeInput.setAttribute('min', today);
        startTimeInput.value = today;
        updateEndTime();

        priceInput.addEventListener('input', function () {
            const currency = currencySelect.value;
            const price = parseFloat(priceInput.value).toFixed(2) || 0;
            priceDisplay.textContent = `${price} ${currency}`;
        });

        scheduleSelect.addEventListener('change', updateEndTime);
        startTimeInput.addEventListener('change', updateEndTime);

        function updateEndTime() {
            const scheduleValue = scheduleSelect.value.split('-');
            const startDate = new Date(startTimeInput.value);
            let endDate = new Date(startDate);

            if (scheduleValue[1] === 'month') {
                endDate.setMonth(endDate.getMonth() + +scheduleValue[0]);
            }
            else if (scheduleValue[1] === 'year') {
                endDate.setFullYear(endDate.getFullYear() + +scheduleValue[0]);
            }

            endTimeInput.value = endDate.toISOString().split('T')[0];
        }

        document.getElementById('complete-listing-btn').addEventListener('click', (e) => {
            e.preventDefault();
            document.getElementById('listing-popup').classList.add('active');
            popupEndTime.textContent = endTimeInput.value;
            popupPrice.textContent = priceDisplay.textContent;
        });

        document.getElementById('popup-close-btn').addEventListener('click', () => {
            document.getElementById('completed-popup').classList.remove('active');
        });
    }

    
});

