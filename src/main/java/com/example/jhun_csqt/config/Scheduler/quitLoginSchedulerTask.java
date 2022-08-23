package com.example.jhun_csqt.config.Scheduler;

/**
 * 定时任务
 *
 * @author wyh
 * @date 2022/1/4
 */
//@Component
//public class quitLoginSchedulerTask implements SchedulingConfigurer {
//
//    private static final Logger log = LoggerFactory.getLogger(quitLoginSchedulerTask.class);
//
//    // 用户账号
//    private String account;
//    public String getAccount() {
//        return account;
//    }
//    public void setAccount(String account) {
//        this.account = account;
//    }
//
//    /**
//     * 默认用户已登录
//     *
//     * @return
//     */
//    public boolean checkUserLoginState() {
//        return (account != null && !account.isEmpty()) &&
//                LoginCache.getCache(account) != null && !LoginCache.getCache(account).isEmpty();
//    }
//
//    /**
//     * 删除用户的登录信息
//     */
//    public void deleteLoginInfo() {
//        if(checkUserLoginState()) {
//            String token = LoginCache.getCache(account);
//            // 删除内存（LoginCache）中保存的有关token的信息
//            LoginCache.deleteCache(token);
//            LoginCache.deleteCache(account);
//        }
//    }
//
//    /**
//     * 动态获取cron表达式
//     *
//     * @return
//     */
//    public String dynamicGetCronExp() {
//        if(checkUserLoginState()) {
//            return "0 0/10 * * * ?";
//        }
//        return "0/1 * * * * ?";
//    }
//
//    @Override
//    public void configureTasks(ScheduledTaskRegistrar scheduledTaskRegistrar) {
//        scheduledTaskRegistrar.addTriggerTask(new Runnable() {
//            @Override
//            public void run() {
//                // 填写执行任务
//
//            }
//        }, new Trigger() {
//            @Override
//            public Date nextExecutionTime(TriggerContext triggerContext) {
//                return null;
//            }
//        });
//    }
//
//}
