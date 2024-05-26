<script>
    import { AngleLeftOutline } from 'flowbite-svelte-icons'
    import { goto, afterNavigate } from '$app/navigation'

    let previousPage = "/"
    let currentPage = "/"

    afterNavigate(({from, to}) => {
        previousPage = from?.url?.pathname || previousPage;
        currentPage = to?.url?.pathname || currentPage;
    })

    const goBack = () => {
		goto(previousPage)
	}
</script>

{#if currentPage !== "/"}
    <div style="height: 52px;"></div>
    <div class="fixed inset-x-0 top-0">
        <nav class="flex justify-between items-center max-w-md mx-auto p-4">
            <button
                type="button"
                on:click={goBack}
                class="flex flex-col items-center text-xs text-gray-700"
            >
                <AngleLeftOutline />
            </button>
        </nav>
    </div>
{/if}
