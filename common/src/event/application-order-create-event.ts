import {Subjects} from "./subjects";
import {DatabaseOrderType} from "./enums/database-order-types";
import {DatabasePlans} from "./enums/database-plans";
import {OrderStatus} from "./enums/order-status";
import {applicationOrderType} from "./enums/application-order-types";
import {ApplicationPlan} from "./enums/application-plan";
export interface ApplicationOrderCreateEvent {
    subject: Subjects.ApplicationCreate;

    data: {
        userId: string;
        status: OrderStatus;
        expiresAt: Date;
        databaseOrderType: applicationOrderType;
        price: number;
        plan: ApplicationPlan;
        gitUrl: string,
        applicationName: string,
        orderId: string,
        port: number,
        envVariables: { key: string, value: string }[]
    }
}