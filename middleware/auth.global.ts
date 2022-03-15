export default defineNuxtRouteMiddleware((to, from) => {
  console.log('middle');
  const cookie = useCookie('user_id');
  if (!cookie.value) {
    if (to.path.includes('/login')) {
      return;
    }
    return navigateTo('/login');
  }
});
