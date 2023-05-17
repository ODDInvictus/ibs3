<script>
  import { env } from '$env/dynamic/public';
</script>

<h1>Over IBS</h1>

<hr />

<p>Invictus Bier Systeem is <i>de</i> webapp voor alles O.D.D. Invictus</p>

<p>Deze app is gemaakt door <a href="https://github.com/Nierot">Niels Rotmensen</a>, <a href="https://github.com/SimplyPancake">Daniel Jonker</a>, <a href="https://github.com/Astronautilus14">Naut de Vroome</a> en <a href="https://github.com/ODDInvictus/ibs3/graphs/contributors">andere contributors</a>

<p>© 2023 - {new Date().getFullYear()} - versie {env.PUBLIC_VERSION} <a
  href={env.PUBLIC_GITHUB_LINK + '/tree/' + env.PUBLIC_GIT_REV}
  >({env.PUBLIC_GIT_REV_SHORT})</a> </p>

<style lang="scss">
  p {
    margin: 0.5rem 0;
  }

  a {
    color: purple;
  }

  h1 {
    text-align: center;
  }

  hr {
    margin: var(--hr-margin);
  }
</style>