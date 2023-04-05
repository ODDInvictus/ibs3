<div id="screen-warning">
  <p>Deze pagina is alleen beschikbaar op een desktop scherm.</p>
  <p>Mocht je dit wel voor mobiel willen, is er zeker wel een plekje voor je vrij in de bakkentrekkers ;)</p>
</div>

<div id="root">
  <slot />
</div>

<style lang="scss">
  #root {
    display: block;
  }

  #screen-warning {
    display: none;
  }

  @media (max-width: 640px) {
    #root {
      display: none;
    }

    #screen-warning {
      display: block;
    }
  }
</style>