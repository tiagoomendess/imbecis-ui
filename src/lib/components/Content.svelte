<script lang="ts">
    export let fullWidth = false
</script>

<div class="w-full h-full">
    {#if fullWidth}
        <slot />
    {:else}
        <div class="container max-w-md mx-auto p-4 mb-20">
            <slot />
        </div>
    {/if}
</div>

<style>
    .h-full {
        height: 100vh;
    }
</style>