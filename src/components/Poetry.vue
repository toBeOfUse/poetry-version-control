<template>
    <div ref="backgroundContainer" :style="gradientBackground" class="background">
        <svg viewBox="0 0 1000 250" style="margin-bottom: -18px">
            <text x="0" y="100" font-size="85" :style="{ fontFamily: dominantFont }">
                Selected Works of
            </text>
            <text x="0" y="200" font-size="85" :style="{ fontFamily: dominantFont }">
                Gaius Valerius Catullus
            </text>
        </svg>
        <hr />
        <p class="credits">
            <span class="serif">Interpreted by Frank O. Copley - </span>
            <span class="sans">Daniel Lavery - </span>
            <span class="extra-serif">Richard Burton</span>
        </p>
        <p class="toc" :class="poetry[0].styles[Number(!whichVersion)]">
            Contents:
            <template v-for="(poem, i) in poetry" :key="poem.title">
                <a :href="'#' + poem.title">{{ poem.title }}</a>
                {{ i == poetry.length - 1 ? "" : " - " }}
            </template>
        </p>
        <template v-for="poem in poetry" :key="poem.title">
            <h2 :class="poem.styles[Number(!whichVersion)]" :id="poem.title">{{ poem.title }}</h2>
            <div
                class="fullPoem"
                @mousemove="updatePointerPos"
                @click="updatePointerPos"
                @mouseenter.self="gradientActive = true"
                @mouseleave="gradientActive = false"
                @touchstart="gradientActive = true"
                @touchmove.prevent="updatePointerPos"
            >
                <template v-for="(line, i) in poem.lines">
                    <template v-for="subLine in line.split('\n')" :key="subLine">
                        <p
                            class="poetryLine"
                            :class="poem.styles[i % 2]"
                            :style="styleText(i % 2)"
                            v-html="subLine"
                        />
                    </template>
                </template>
            </div>
        </template>
    </div>
    <div id="gutter" @click="gradientActive = false">
        <div id="toggle">
            <label class="switch">
                <input type="checkbox" checked v-model="whichVersion" />
                <span class="slider"></span>
            </label>
        </div>
        <svg id="scrolly">
            <defs>
                <linearGradient id="fadeIn" gradientTransform="rotate(90)">
                    <stop offset="0%" stop-color="white" />
                    <stop offset="100%" stop-color="white" stop-opacity="0" />
                </linearGradient>
                <linearGradient id="fadeOut" gradientTransform="rotate(90)">
                    <stop offset="0%" stop-color="white" stop-opacity="0" />
                    <stop offset="100%" stop-color="white" />
                </linearGradient>
                <linearGradient id="ridge" gradientTransform="rotate(90)">
                    <stop offset="0%" stop-color="#ccc" />
                    <stop offset="100%" stop-color="#333" />
                </linearGradient>
            </defs>
            <rect
                v-for="i in 25"
                :key="i"
                x="0px"
                width="30px"
                :y="i * 20 - (scrollPos % 20) + 'px'"
                height="4px"
                fill="url(#ridge)"
                ry="2px"
            />
            <rect x="0" y="0" width="40px" height="30px" fill="url(#fadeIn)" />
            <rect x="0" y="470px" width="40px" height="30px" fill="url(#fadeOut)" />
        </svg>
    </div>
</template>

<script setup>
import { computed, ref, watch } from "vue";
import poetry from "../assets/lines.json";

const whichVersion = ref(true);
const gradientActive = ref(false);
const mousePosPercent = ref(0);
const backgroundContainer = ref(null);
const scrollPos = ref(0);

window.addEventListener("scroll", () => {
    scrollPos.value = window.scrollY;
});

watch(whichVersion, () => {
    gradientActive.value = false;
});

const makeGradient = centerPos =>
    `linear-gradient(white -10%, ` +
    `white calc(${centerPos}% - 80px), ` +
    `black calc(${centerPos}% - 40px), ` +
    `black ${centerPos}%, ` +
    `black calc(${centerPos}% + 40px), ` +
    `white calc(${centerPos}% + 80px), ` +
    `white 110%)`;
const gradientBackground = computed(() => {
    if (gradientActive.value) {
        return { backgroundImage: makeGradient(mousePosPercent.value) };
    } else {
        return { backgroundColor: "white" };
    }
});

const updatePointerPos = event => {
    if (!backgroundContainer.value) {
        return;
    }
    const box = backgroundContainer.value.getBoundingClientRect();
    const eventY = event.clientY || event.touches[0].clientY;
    mousePosPercent.value = ((eventY - box.top) / box.height) * 100;
};

const styleText = zeroOrOne => ({
    color: whichVersion.value == !!zeroOrOne ? "rgba(1,1,1,0.15)" : "black"
});

const dominantFont = computed(() => (whichVersion.value ? "Crimson Pro" : "OpenSauceOne"));
</script>

<style lang="scss">
@import "~pretty-checkbox/src/pretty-checkbox.scss";

@font-face {
    font-family: "OpenSauceOne";
    src: url("../../public/fonts/opensauceone-regular-webfont.woff2") format("woff2"),
        url("../../public/fonts/opensauceone-regular-webfont.woff") format("woff");
    font-weight: normal;
    font-style: normal;
}

@font-face {
    font-family: "Kontrapunkt Light";
    src: url("../../public/fonts/Kontrapunkt-Light.woff") format("woff");
    font-weight: normal;
    font-style: normal;
}

@import url("https://fonts.googleapis.com/css2?family=Crimson+Pro&display=swap");

html {
    font-size: 16px;
    @media (max-width: 700px) {
        font-size: 12px;
    }
}

body {
    margin: 0;
}

hr {
    margin: 20px 0;
}

a {
    color: black;
}

$serif-scale-factor: 1.2;
.serif {
    font-family: "Crimson Pro";
}

$sans-scale-factor: 1;
.sans {
    font-family: "OpenSauceOne";
}

$extra-serif-scale-factor: 1.1;
.extra-serif {
    font-family: "Kontrapunkt Light";
}

h2 {
    font-weight: normal;
    font-style: italic;
    height: 1.6rem;
    margin: 15px 0;
    &.serif {
        font-size: 1.4rem * $serif-scale-factor;
    }
    &.sans {
        font-size: 1.4rem * $sans-scale-factor;
    }
    &.extra-serif {
        font-size: 1.4rem * $extra-serif-scale-factor;
    }
}

.poetryLine {
    margin: 6px 0;
    transition: color 0.25s;
    line-height: 1.5;
    white-space: pre-wrap;
    &.serif {
        font-size: 1rem * $serif-scale-factor;
    }
    &.sans {
        font-size: 1rem * $sans-scale-factor;
    }
    &.extra-serif {
        font-size: 1rem * $extra-serif-scale-factor;
    }
}

.credits {
    .serif {
        font-size: 1.1rem * $serif-scale-factor;
    }
    .sans {
        font-size: 1.1rem * $sans-scale-factor;
    }
    .extra-serif {
        font-size: 1.1rem * $extra-serif-scale-factor;
    }
}

.toc {
    &.serif {
        font-size: 0.8rem * $serif-scale-factor;
    }
    &.sans {
        font-size: 0.8rem * $sans-scale-factor;
    }
    &.extra-serif {
        font-size: 0.8rem * $extra-serif-scale-factor;
    }
}

.background {
    width: 50%;
    max-width: 650px;
    @media (max-width: 700px) {
        width: 85%;
        max-width: unset;
    }
    padding: 5px;
    background-clip: text;
    -webkit-background-clip: text;
}

#toggle {
    position: fixed;
    top: 100px;
    left: 75%;
    @media (max-width: 700px) {
        top: 30px;
        left: unset;
        right: 5px;
    }
}

#gutter {
    @media (max-width: 700px) {
        width: 50px;
    }
}

#scrolly {
    position: fixed;
    right: 10px;
    top: 50%;
    transform: translateY(-50%);
    width: 30px;
    height: 500px;
    @media (min-width: 700px) {
        display: none;
    }
}

#app {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-evenly;
    @media (max-width: 700px) {
        align-items: stretch;
    }
}

// https://www.w3schools.com/howto/howto_css_switch.asp

$switch-width: 40px;
$switch-height: 23px;
$toggle-indicator-radius: 18px;

.switch {
    position: relative;
    display: inline-block;
    width: $switch-width;
    height: $switch-height;
}

.switch input {
    opacity: 0;
    width: 0;
    height: 0;
}

.slider {
    position: absolute;
    cursor: pointer;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: #ccc;
    -webkit-transition: 0.4s;
    transition: 0.4s;
    border-radius: $switch-height;
}

.slider:before {
    position: absolute;
    content: "";
    height: $toggle-indicator-radius;
    width: $toggle-indicator-radius;
    left: 2px;
    bottom: 2px;
    background-color: white;
    -webkit-transition: 0.4s;
    transition: 0.4s;
    border-radius: 50%;
}

input:checked + .slider {
    background-color: #787878;
}

input:focus + .slider {
    box-shadow: 0 0 1px #787878;
}

input:checked + .slider:before {
    -webkit-transform: translateX($toggle-indicator-radius);
    -ms-transform: translateX($toggle-indicator-radius);
    transform: translateX($toggle-indicator-radius);
}
</style>
