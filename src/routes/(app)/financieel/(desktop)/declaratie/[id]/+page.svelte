<script>
  import { page } from '$app/stores';
	import { PUBLIC_RECEIPT_URL } from '$env/static/public';

  console.log($page.data.declaration);
</script>

<div id="root">
  <h1>Declaratie {$page.data.declaration.id}</h1>
  <p>Het bewerken is helaas nog niet mogelijk, boeie ruurd</p>

  <img src={PUBLIC_RECEIPT_URL + $page.data.declaration.receipt} alt="Helaas is hier geen bonnetje voor geupload :(" />
</div>

<style>
  h1 {
    font-size: 1.5rem;
  }
</style>