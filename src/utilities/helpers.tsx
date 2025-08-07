import  {DateTime} from "luxon"

export const convertToHumanTime = (date: string) => {
    const dateTimeObj = DateTime.fromISO(date); 
    const now = DateTime.now()

    return dateTimeObj.toRelative({base: now})+" ago"
}