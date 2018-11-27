<template>
  <div class="dashboard-container">
    <component :is="currentDashboard"/>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import accountDashboard from './account'
import employeeDashboard from './employee'

export default {
  name: 'Dashboard',
  components: { accountDashboard, employeeDashboard },
  data() {
    return {
      currentDashboard: null
    }
  },
  computed: {
    ...mapGetters(['type'])
  },
  created() {
    if (this.type === 'employee') {
      this.currentDashboard = 'employeeDashboard'
    } else {
      this.currentDashboard = 'accountDashboard'
    }
  }
}
</script>
