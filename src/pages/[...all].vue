<template>
  <div id="notfound">
    <div class="notfound">
      <div class="notfound-404">
        <h1>404</h1>
      </div>
      <h2>Oops! Nothing was found</h2>
      <p>
        The page you are looking for might have been removed had its name changed or is temporarily unavailable.
        <a href="/">Return to homepage</a>
      </p>
      <div class="notfound-social"></div>
    </div>
  </div>
</template>
<script setup>
  // export default {};
  import routes from 'virtual:generated-pages';

  console.log(routes);
</script>
<style lang="scss" scoped>

  #notfound {
    position: relative;
    height: 100vh;
  }

  #notfound .notfound {
    position: absolute;
    left: 50%;
    top: 50%;
    -webkit-transform: translate(-50%, -50%);
    -ms-transform: translate(-50%, -50%);
    transform: translate(-50%, -50%);
  }

  .notfound {
    max-width: 767px;
    width: 100%;
    line-height: 1.4;
    text-align: center;
    padding: 15px;
  }

  .notfound .notfound-404 {
    position: relative;
    height: 220px;
  }

  .notfound .notfound-404 h1 {
    font-family: 'Kanit', sans-serif;
    position: absolute;
    left: 50%;
    top: 50%;
    -webkit-transform: translate(-50%, -50%);
    -ms-transform: translate(-50%, -50%);
    transform: translate(-50%, -50%);
    font-size: 186px;
    font-weight: 200;
    margin: 0px;
    background: linear-gradient(130deg, #4fff58, #1d6441);
    color: transparent;
    -webkit-background-clip: text;
    background-clip: text;
    text-transform: uppercase;
  }

  .notfound h2 {
    font-family: 'Kanit', sans-serif;
    font-size: 33px;
    font-weight: 200;
    text-transform: uppercase;
    margin-top: 0px;
    margin-bottom: 25px;
    letter-spacing: 3px;
  }

  .notfound p {
    font-family: 'Kanit', sans-serif;
    font-size: 16px;
    font-weight: 200;
    margin-top: 0px;
    margin-bottom: 25px;
  }

  .notfound a {
    font-family: 'Kanit', sans-serif;
    color: #ff6f68;
    font-weight: 200;
    text-decoration: none;
    border-bottom: 1px dashed #ff6f68;
    border-radius: 2px;
  }

  .notfound-social > a {
    display: inline-block;
    height: 40px;
    line-height: 40px;
    width: 40px;
    font-size: 14px;
    color: #ff6f68;
    border: 1px solid #efefef;
    border-radius: 50%;
    margin: 3px;
    -webkit-transition: 0.2s all;
    transition: 0.2s all;
  }
  .notfound-social > a:hover {
    color: #fff;
    background-color: #ff6f68;
    border-color: #ff6f68;
  }

  @media only screen and (max-width: 480px) {
    .notfound .notfound-404 {
      position: relative;
      height: 168px;
    }

    .notfound .notfound-404 h1 {
      font-size: 142px;
    }

    .notfound h2 {
      font-size: 22px;
    }
  }
</style>
