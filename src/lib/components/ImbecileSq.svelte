<script lang="ts">
	import { goto } from '$app/navigation';
	import Plate from '$lib/components/Plate.svelte';
    import { MapLocationOutline, CalendarMonthOutline } from 'flowbite-svelte-icons';

	export let picture = 'https://via.placeholder.com/900';
	export let plateNumber: string | null = null;
	export let plateCountry: string | null = null;
	export let municipality: string | null = 'Local Desconhecido';
    export let date: string | null = null;
    export let id: string | null = null;
    
    const clicks = [] as Date[]

    const mapIconClicked = () => {
        if (clicks.length > 30) {
            clicks.length = 0
        }

        clicks.push(new Date())
        // if clicked 3 times in less than 2 second
        if (id && clicks.length >= 3 && clicks[clicks.length - 1].getTime() - clicks[clicks.length - 3].getTime() < 2000) {
            clicks.length = 0
            goto(`/reports/${id}`)
        }
    }
</script>

<div class="aspect-square outer-square">
	<img src={picture} alt={plateNumber} />
	<div class="inner-square">
		
        <div class="stick-top text-sm">
            <div class="flex items-center">
                <MapLocationOutline on:click={mapIconClicked}/>
                <span class="ml-1">{ municipality }</span>
            </div>
            <div class="flex items-center">
                {#if date}
                    <CalendarMonthOutline/>
                    <span class="ml-1">{date}</span>
                {/if}
            </div>
        </div>
        <div class="stick-bottom">
            {#if plateNumber && plateCountry}
            <a href={`matriculas/${plateCountry}/${plateNumber}`}>
                <Plate number={plateNumber} country={plateCountry} />
            </a>
            {/if}
        </div>
	</div>
</div>

<style>
	.outer-square {
		position: relative;
		border-radius: 10px;
		background-color: rgb(212, 212, 212);
		overflow: hidden;
		margin-bottom: 20px;
        box-shadow: 0 0 30px rgba(0, 0, 0, 0.23);
	}

	.outer-square > img {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: auto;
		z-index: 2;
	}

    .inner-square {
		position: absolute;
		top: 0;
		left: 0;
		z-index: 10;
        width: 100%;
        height: 100%;
	}

    .stick-bottom {
        position: absolute;
        bottom: 0;
        left: 0;
        width: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 10px;
    }

    .stick-top {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 1rem;
        color: white;
        background-color: rgba(0, 0, 0, 0.40);
    }

</style>
