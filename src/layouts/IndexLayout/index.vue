<template>
    <div id="indexlayout">
        <left
          :collapsed="collapsed"          
          :topNavEnable="topNavEnable"
          :belongTopMenu="belongTopMenu"
          :defaultActive="defaultActive"
          :menuData="permissionMenuData"
          :routeItem="routeItem"
        >
        </left>

        <div
          id="indexlayout-right"
          :class="{'fiexd-header': headFixed}"
        >

            <right-top
              :collapsed="collapsed"
              :tabNavEnable="tabNavEnable"
              :topNavEnable="topNavEnable"
              :belongTopMenu="belongTopMenu"
              :toggleCollapsed="toggleCollapsed"
              :breadCrumbs="breadCrumbs"
              :menuData="permissionMenuData"
              :routeItem="routeItem"
            >              
            </right-top>

            <div class="indexlayout-right-main">
                <permission :roles="routeItem.roles">
                  <router-view></router-view>
                </permission>
                <right-footer></right-footer>
            </div>

        </div>

        <settings></settings>

    </div>
</template>
<script lang="ts">
import { defineComponent, computed, ComputedRef, watch, ref, Ref, nextTick } from "vue";
import { useStore } from 'vuex';
import { useRoute } from 'vue-router';
import { StateType as GlobalStateType } from '@/store/global';
import { StateType as UserStateType } from "@/store/user";
import { 
  PathJsonRoutesDataItem, vueRoutes, jsonPathVueRoutes, RoutesDataItem, getJsonRouteItem, getSelectLeftMenuPath, 
  getRouteBelongTopMenu, getBreadcrumbRoutes,
  BreadcrumbType, getPermissionMenuData
} from '@/utils/routes';
import useTitle from '@/composables/useTitle';
import IndexLayoutRoutes from './routes';
import Permission from '@/components/Permission/index.vue';
import Left from './components/Left.vue';
import RightTop from './components/RightTop.vue';
import RightFooter from './components/RightFooter.vue';
import Settings from "./components/Settings.vue";

interface IndexLayoutSetupData {
  collapsed: ComputedRef<boolean>;
  toggleCollapsed: () => void;
  tabNavEnable: ComputedRef<boolean>;
  topNavEnable: ComputedRef<boolean>;
  belongTopMenu: ComputedRef<string>;
  headFixed: ComputedRef<boolean>;
  defaultActive: Ref<string>;
  breadCrumbs: ComputedRef<BreadcrumbType[]>;
  permissionMenuData: ComputedRef<RoutesDataItem[]>;
  routeItem: ComputedRef<RoutesDataItem>;
}

export default defineComponent({
    name: 'IndexLayout',
    components: {
        Permission,
        Left,
        RightTop,
        RightFooter,
        Settings
    },
    setup(): IndexLayoutSetupData {
        const store = useStore<{
            global: GlobalStateType;
            user: UserStateType;
        }>(); 
        const route = useRoute();


        // ??????????????????
        const menuData: RoutesDataItem[] = vueRoutes(IndexLayoutRoutes); 
        
        // ???????????????????????????json??????????????????parentPath
        const jsonPathRoutes: PathJsonRoutesDataItem = jsonPathVueRoutes(menuData)

        // ???????????? item
        const routeItem = computed<RoutesDataItem>(()=> getJsonRouteItem(route.path, jsonPathRoutes));

        // ??????????????????
        const permissionMenuData = computed<RoutesDataItem[]>(()=> getPermissionMenuData(store.state.user.currentUser.roles, menuData));

        // ???????????????????????????path
        const belongTopMenu = computed<string>(()=>getRouteBelongTopMenu(routeItem.value))

        // ????????????
        const collapsed = computed<boolean>(()=> store.state.global.collapsed);
        const toggleCollapsed = (): void => {
          store.commit('global/changeLayoutCollapsed', !collapsed.value);
        }

         // ????????????tabNav????????????
        const tabNavEnable = computed<boolean>(()=> store.state.global.tabNavEnable);

        // ??????????????????????????????
        const topNavEnable = computed<boolean>(()=> store.state.global.topNavEnable);

        // ????????????????????????
        const headFixed = computed<boolean>(()=> store.state.global.headFixed);


        // ?????????????????????
        // const defaultActive = computed<string>(()=> getSelectLeftMenuPath(routeItem.value));
        const defaultActive = ref<string>(getSelectLeftMenuPath(routeItem.value));
        watch([routeItem], async () => {
          await nextTick();          
          defaultActive.value = getSelectLeftMenuPath(routeItem.value);
        })


        // ???????????????
        const breadCrumbs = computed<BreadcrumbType[]>(() => getBreadcrumbRoutes(route.path, jsonPathRoutes));

        // ??????title
        useTitle(routeItem);

        
        return {
          collapsed,
          toggleCollapsed,
          tabNavEnable,
          topNavEnable,
          belongTopMenu,
          headFixed, 
          defaultActive,
          breadCrumbs,
          permissionMenuData,
          routeItem
        }


    }
})
</script>
<style lang="scss">
@import './css/index.scss';
</style>