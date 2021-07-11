export const passwordLimitOptions = {min:6, max: 20};
export const passwordLimitOptionErrorMessage = (field: string) => field+' must be between 6 and 20 characters';

export const clusterUrl = '/events';

export const EXAMPLE_APPLICATION_NAME = 'example-space';

export interface ExistingUserType {
    password: string;
    userName: string;
    jwtId: string;
    _id: string;
    userGroupIds: [string]
}
