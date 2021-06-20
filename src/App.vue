<template>
  <div id="app">
    <div>
      <b-navbar toggleable="lg" type="dark" variant="dark" class="mb-5" id="nav">
        <b-navbar-brand href="#">Rust Helper</b-navbar-brand>
        <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

        <b-collapse id="nav-collapse" is-nav>
          <b-navbar-nav>
            <b-nav-item to="/">Overview</b-nav-item>
            <b-nav-item to="/about">About</b-nav-item>
          </b-navbar-nav>
        </b-collapse>
      </b-navbar>
    </div>

    <router-view />
  </div>
</template>

<style lang="css">
@import url('https://fonts.googleapis.com/css2?family=Raleway&display=swap');

body
{
  background-color:#CE422B;
  color:white;
}

#nav
{
  font-family: 'Raleway';
  background-color:#1e2020 !important;
}
</style>
