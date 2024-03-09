<script lang="ts">
export let country : string = "default";
export let number : string = "0000";

if (country === "pt" && number.length === 6) {
    number = `${number.slice(0, 2)} ${number.slice(2, 4)} ${number.slice(4, 6)}`
}

// if not portugal set default
if (country !== "pt" && country !== "fr") {
    country = "default";
}

</script>

<div class="plate">
    <div class="inner-plate-{country}">
        <div class="left-side"></div>
        <span>{number}</span>
        <div class="right-side"></div>
    </div>
</div>

<style>
    .plate {
        display: inline-block;
        overflow: hidden;
        position: relative;
        border-radius: 3px;
        overflow: hidden;
    }

    .inner-plate-pt {
        color: rgb(32, 32, 32);
        padding: 0;
        display: flex;
        flex-direction: row;
        z-index: 1;
    }

    .inner-plate-pt > span {
        padding: 0 8px;
        font-size: 1.2em;
        background-color: white;
        color: black;
        font-weight: 600;
    }

    .inner-plate-pt > .left-side {
        background-image: url('/plate_pt_left.webp');
        background-size: contain;
        background-repeat: no-repeat;
        background-color: rgb(0, 0, 161);
        border-radius: 5px 0 0 5px;
        width: 14px;
        height: 29px;
        z-index: 11;
    }

    .left-side-pt {
        display: none;
    }

    .inner-plate-default {
        color: rgb(32, 32, 32);
        background-color: white;
        padding: 0 7px;
        display: flex;
        flex-direction: row;
        z-index: 1;
        font-weight: 600;
    }

</style>
