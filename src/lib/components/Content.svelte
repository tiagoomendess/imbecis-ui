<script lang="ts">
    export let fullWidth = false
</script>

<div class="w-full">
    {#if fullWidth}
        <slot />
    {:else}
        <div class="container max-w-md mx-auto p-4">
            <slot />
        </div>
    {/if}
</div>
