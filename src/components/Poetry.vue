<template>
    <div
        ref="backgroundContainer"
        :style="gradientBackground"
        @mousemove="updatePointerPos"
        @click="updatePointerPos"
        @mouseenter.self="gradientActive = true"
        @mouseleave="gradientActive = false"
        @touchstart="gradientActive = true"
        @touchmove.prevent="updatePointerPos"
        class="background"
    >
        <svg viewBox="0 0 1000 250" style="margin-bottom: -18px">
            <text x="0" y="100" font-size="85" :style="{ fontFamily: dominantFont }">
                Selected Works of
            </text>
            <text x="0" y="200" font-size="85" :style="{ fontFamily: dominantFont }">
                Gaius Valerius Catullus
            </text>
        </svg>
        <template v-for="poem in poetry" :key="poem.title">
            <h2 :class="classifyText(Number(!whichVersion))">{{ poem.title }}</h2>
            <template v-for="(line, i) in poem.lines">
                <template v-for="subLine in line.split('\n')" :key="subLine">
                    <p
                        class="poetryLine"
                        :class="classifyText(i % 2)"
                        :style="styleText(i % 2)"
                        v-html="subLine"
                    />
                </template>
            </template>
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
            </defs>
            <line
                v-for="i in 25"
                :key="i"
                x1="0px"
                x2="30px"
                :y1="i * 20 - (scrollPos % 20) + 'px'"
                :y2="i * 20 - (scrollPos % 20) + 'px'"
                stroke="black"
                stroke-width="2px"
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
const gradientBackground = computed(() => ({
    background: gradientActive.value ? makeGradient(mousePosPercent.value) : "white",
    backgroundClip: "text"
}));

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
const classifyText = zeroOrOne => (zeroOrOne ? "sans" : "serif");
const dominantFont = computed(() => (whichVersion.value ? "Crimson Pro" : "OpenSauceOne"));
</script>

<style lang="scss">
@import "~pretty-checkbox/src/pretty-checkbox.scss";

@font-face {
    font-family: "OpenSauceOne";
    src: url("/fonts/opensauceone-regular-webfont.woff2") format("woff2"),
        url("/fonts/opensauceone-regular-webfont.woff") format("woff");
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

h2 {
    font-weight: normal;
    font-style: italic;
    height: 30px;
    font-size: 2rem;
    margin: 15px 0;
    &.serif {
        font-family: "Crimson Pro";
        font-size: 2rem;
    }
    &.sans {
        font-family: "OpenSauceOne";
        font-size: 1.6rem;
    }
}

.poetryLine {
    margin: 6px 0;
    transition: color 0.25s;
    line-height: 1.5;
    white-space: pre-wrap;
    &.serif {
        font-family: "Crimson Pro";
        font-size: 1.2rem;
    }
    &.sans {
        font-family: "OpenSauceOne";
        font-size: 1rem;
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
}

#toggle {
    position: fixed;
    top: 100px;
    right: 50px;
    @media (max-width: 700px) {
        top: 30px;
        right: 10px;
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
    top: 100px;
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

.switch {
    position: relative;
    display: inline-block;
    width: 30px;
    height: 17px;
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
    border-radius: 17px;
}

.slider:before {
    position: absolute;
    content: "";
    height: 13px;
    width: 13px;
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
    -webkit-transform: translateX(13px);
    -ms-transform: translateX(13px);
    transform: translateX(13px);
}
</style>
