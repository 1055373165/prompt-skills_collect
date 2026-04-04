# 给 Dev Autopilot 的输入模板

## 你应该提供什么

Autopilot 的 Phase 1 会自动做三件事：理解需求 → 澄清歧义 → 锁定需求。
Phase 2 会自动扫描代码库并设计架构。

所以你的输入应该是 **"问题+目标+约束"**，不是实现方案。

三种输入对比：

| 输入类型 | 效果 | 风险 |
|---------|------|------|
| 一句模糊需求 | Phase 1 需要 2-3 轮 WAIT 澄清 | 方向偏离、锁定慢 |
| 问题+目标+约束（推荐） | Phase 1 一轮澄清即可锁定 | 无明显风险 |
| 详细架构/重构文档 | Phase 2 架构设计变成走形式 | 跳过对抗性思考，ADR 质量下降 |

## 推荐输入结构（直接填写后发给 autopilot）

```
我要做的事：
[一段话说清楚：什么问题存在 → 期望的终态是什么]

背景：
- 涉及的模块/功能区域：[例：frontend/src/features/fund-flow + backend/app/services/fund_flow_service.py]
- 当前状态：[例：资金流向页面加载需要 5 次 API 调用，首屏 3s+]
- 用户/调用方：[例：散户用户在移动端查看资金流向]

硬约束（不可违反）：
- [例：必须兼容现有 WebSocket 协议]
- [例：不能引入新的外部依赖]
- [例：后端接口变更必须向后兼容]

质量目标（按优先级）：
1. [例：首屏加载 <1s]
2. [例：API 调用数从 5 降到 1]
3. [例：代码可测试性提升]

明确不做的事：
- [例：不改动数据库 schema]
- [例：不涉及用户认证流程]
```

## 为什么这样设计

Autopilot Phase 1 Step 2 会从你的输入中提取 6 个维度：
1. **Core goal** — 你的"我要做的事"
2. **Required capabilities** — 从"背景"和"质量目标"推导
3. **Expected users** — 你的"用户/调用方"
4. **Technical boundaries** — 你的"硬约束"
5. **Implicit requirements [TO CONFIRM]** — AI 自己补充，Phase 1 Step 3 会问你确认
6. **Risks** — AI 自己识别

你提供前 4 个，AI 补后 2 个，然后一轮 WAIT 确认即可锁定。

## 实际示例

**差的输入**：
> 重构资金流向模块

结果：Phase 1 会问你至少 5 个问题（为什么重构？范围多大？前后端都改？性能目标？兼容性？）

**好的输入**：
> 我要做的事：资金流向页面首屏加载太慢（3s+），根因是前端同时发 5 个独立 API 请求。
> 目标是后端提供一个聚合接口 /fund-flow/dashboard，一次返回排行+板块+信号数据，
> 前端从 5 个 useQuery 改成 1 个。
>
> 背景：涉及 frontend/src/features/fund-flow/index.tsx 和 backend/app/api/v1/fund_flow.py + fund_flow_service.py。
> 当前 FundFlowCollector 存在多实例问题。
>
> 硬约束：不改数据库 schema，AkShare 调用必须走统一限流（akshare_api_client.py）。
>
> 质量目标：首屏 API 调用 1 次，FundFlowCollector 单例化。
>
> 不做：不改 WebSocket 实时推送逻辑，不动 Redis 缓存策略。

结果：Phase 1 可能只需确认 1-2 个隐含假设即可锁定。

## 如果你已经有详细设计文档怎么办

不要直接把整个设计文档贴进去。而是：

1. 用上面的模板写一份"问题+目标+约束"
2. 在末尾加一行：`参考设计文档：[路径]`
3. 让 Phase 2 自己读文档并做对抗性检验

这样 autopilot 的架构设计阶段会以你的文档为起点做独立验证，而不是无脑复制你的方案。
如果它发现你的方案有问题，会在 ARCH_DESIGNING 的 WAIT 门控处告诉你。