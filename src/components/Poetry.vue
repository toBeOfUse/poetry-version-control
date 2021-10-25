<template>
    <div
        ref="backgroundContainer"
        :style="gradientBackground"
        @mousemove="updateMousePos"
        @mouseenter.self="gradientActive = true"
        @mouseleave="gradientActive = false"
        class="background"
    >
        <svg viewBox="0 0 1000 250">
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
    <div id="gutter">
        <div class="pretty p-switch p-fill" id="toggle">
            <input type="checkbox" v-model="whichVersion" />
            <div class="state">
                <label>&nbsp;</label>
            </div>
        </div>
    </div>
</template>

<script setup>
import { computed, ref } from "vue";
import poetry from "../assets/lines.json";

const whichVersion = ref(true);
const gradientActive = ref(false);
const mousePosPercent = ref(0);
const backgroundContainer = ref(null);

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

const updateMousePos = event => {
    if (!backgroundContainer.value) {
        return;
    }
    const box = backgroundContainer.value.getBoundingClientRect();
    mousePosPercent.value = ((event.clientY - box.top) / box.height) * 100;
};

const styleText = zeroOrOne => ({
    color: whichVersion.value == !!zeroOrOne ? "rgba(1,1,1,0.1)" : "black"
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

body {
    margin: 0;
}

h2 {
    font-weight: normal;
    font-style: italic;
    height: 30px;
    font-size: 25px;
    margin: 15px 0;
    &.serif {
        font-family: "Crimson Pro";
        font-size: 30px;
    }
    &.sans {
        font-family: "OpenSauceOne";
        font-size: 25px;
    }
}

.poetryLine {
    margin: 6px 0;
    transition: color 0.25s;
    line-height: 1.5;
    @media (max-width: 700px) {
        font-size: 90%;
        line-height: 1.2;
    }
    &.serif {
        font-family: "Crimson Pro";
        font-size: 1.2em;
    }
    &.sans {
        font-family: "OpenSauceOne";
        font-size: 1em;
    }
}

.background {
    width: 50%;
    max-width: 650px;
    @media (max-width: 700px) {
        width: 85%;
        max-width: unset;
    }
    flex-shrink: 0;
    padding: 5px;
}

#toggle {
    position: fixed;
    top: 100px;
    right: 20%;
    @media (max-width: 700px) {
        top: 20px;
        right: -20px;
    }
}

#gutter {
    @media (max-width: 700px) {
        background-color: lightgray;
        width: 100%;
        flex-shrink: 1;
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
</style>
