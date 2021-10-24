<template>
    <div
        ref="backgroundContainer"
        :style="gradientBackground"
        @mousemove="updateMousePos"
        @mouseenter.self="gradientActive = true"
        @mouseleave="gradientActive = false"
        class="background"
    >
        <template v-for="linePair in lines">
            <template v-for="(lines, zeroOrOne) in linePair">
                <template v-for="line in lines.split('\n')" :key="line">
                    <p class="poetryLine" :style="styleText(zeroOrOne)">
                        {{ line }}
                    </p>
                </template>
            </template>
        </template>
    </div>
    <div class="pretty p-switch p-fill">
        <input type="checkbox" v-model="whichVersion" />
        <div class="state">
            <label>&nbsp;</label>
        </div>
    </div>
</template>

<script setup>
import { computed, ref } from "vue";

const lines = [
    ["This is line 1", "Other version of line 1"],
    ["Line 2 gets turned into two lines", "Line 2\nGets turned into two lines"]
];
const whichVersion = ref(true);
const gradientActive = ref(false);
const mousePosPercent = ref(0);
const backgroundContainer = ref(null);

const makeGradient = centerPos =>
    gradientActive.value
        ? `linear-gradient(white -10%, ` +
          `white calc(${centerPos}% - 40px), ` +
          `black calc(${centerPos}% - 20px), ` +
          `black ${centerPos}%, ` +
          `black calc(${centerPos}% + 20px), ` +
          `white calc(${centerPos}% + 40px), ` +
          `white 110%)`
        : "white";
const gradientBackground = computed(() => ({
    background: makeGradient(mousePosPercent.value),
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
    color: whichVersion.value == !!zeroOrOne ? "rgba(1,1,1,0.1)" : "black",
    fontFamily: zeroOrOne ? "OpenSauceOne" : "Crimson Pro",
    fontSize: zeroOrOne ? "1em" : "1.3em"
});
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

.poetryLine {
    margin: 0;
    padding: 6px 0;
    transition: color 0.25s;
}

.background {
    width: 40%;
}

#app {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
}
</style>
