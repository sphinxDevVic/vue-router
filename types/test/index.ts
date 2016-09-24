import Vue = require("vue");
import { ComponentOptions } from "vue";

import VueRouter = require("../index");
import { Route, RouteRecord, RedirectOption } from "../index";

Vue.use(VueRouter);

const Home = { template: "<div>home</div>" };
const Foo = { template: "<div>foo</div>" };
const Bar = { template: "<div>bar</div>" };

const Hook: ComponentOptions<{ a: string } & Vue> = {
  template: "<div>hook</div>",

  beforeRouteEnter (route, redirect, next) {
    route.params;
    redirect("/");
    next(vm => {
      vm.a = "done";
    });
  },

  beforeRouteLeave (route, redirect, next) {
    route.params;
    redirect("/");
    next();
  }
};

const router = new VueRouter({
  mode: "history",
  base: "/",
  linkActiveClass: "active",
  scrollBehavior: (to, from, savedPosition) => {
    if (from.path === "/") {
      return { selector: "#app" };
    }

    if (to.path === "/child") {
      return;
    }

    if (savedPosition) {
      return savedPosition;
    }
  },
  routes: [
    { path: "/", name: "home", component: Home, children: [
      {
        path: "child",
        components: {
          default: Foo,
          bar: Bar
        },
        meta: { auth: true },
        beforeEnter (route, redirect, next) {
          route.params;
          redirect({ name: "home" });
          next();
        }
      },
      {
        path: "children",
        redirect: to => {
          to.params;
          return "/child";
        }
      }
    ]},
    { path: "/home", alias: "/" },
    { path: "*", redirect: "/" }
  ]
});

const App: Vue = router.app;
const mode: string = router.mode;

const route: Route = router.currentRoute;
const path: string = route.path;
const name: string | undefined = route.name;
const hash: string = route.hash;
const query: string = route.query["foo"];
const params: string = route.params["bar"];
const fullPath: string = route.fullPath;
const redirectedFrom: string | undefined = route.redirectedFrom;
const meta: any = route.meta;
const matched: RouteRecord[] = route.matched;

matched.forEach(m => {
  const path: string = m.path;
  const components: {
    [key: string]: ComponentOptions<Vue> | typeof Vue
  } = m.components;
  const instances: { [key: string]: Vue } = m.instances;
  const name: string | undefined = m.name;
  const parant: RouteRecord | undefined = m.parent;
  const redirect: RedirectOption | undefined = m.redirect;
});

router.beforeEach((route, redirect, next) => {
  route.params;
  redirect("/");
  next();
});

router.afterEach(route => {
  route.params;
});

router.push({
  path: "/",
  params: {
    foo: "foo"
  },
  query: {
    bar: "bar"
  },
  hash: "hash"
});
router.replace({ name: "home" });

router.go(-1);
router.back();
router.forward();

const Components: ComponentOptions<Vue> | typeof Vue = router.getMatchedComponentes();

const vm = new Vue({
  router,
  template: `
    <div id="app">
      <h1>Basic</h1>
      <ul>
        <li><router-link to="/">/</router-link></li>
        <li><router-link to="/foo">/foo</router-link></li>
        <li><router-link to="/bar">/bar</router-link></li>
      </ul>
      <router-view class="view"></router-view>
    </div>
  `
}).$mount("#app");

vm.$router.push("/");
vm.$route.params;
