import { ProjectActivityOutDTO } from "@workspace/api/src/modules/project/dtos/project.out.dto";

export const getProjectActivityCostSum = (activity: ProjectActivityOutDTO) => activity.costs?.reduce((p, n) => p + n.amount, 0);

export const getProjectActivitiesCostSum = (activities: ProjectActivityOutDTO[]) => activities.reduce((p, n) => p + getProjectActivityCostSum(n), 0);
