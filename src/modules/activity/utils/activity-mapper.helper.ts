export class ActivityMapper {
  static mapToDto(activity: any) {
    return {
      id: activity.id,
      timestamp: activity.timestamp,
      user: {
        id: activity.user.id,
        name: activity.user.name,
        avatar: activity.user.profileImage
      },
      description: activity.description,
      projectName: activity.project.name,
      ipAddress: activity.ipAddress || undefined,
      actionType: activity.actionType,
      metadata: activity.metadata || undefined,
    };
  }

  static mapUserActivityToDto(activity: any, includeIp: boolean) {
    const result: any = {
      id: activity.id,
      timestamp: activity.timestamp,
      description: activity.description,
      projectName: activity.project.name,
      actionType: activity.actionType,
      metadata: activity.metadata || undefined,
    };

    if (includeIp) {
      result.ipAddress = activity.ipAddress || undefined;
    }

    return result;
  }
}
