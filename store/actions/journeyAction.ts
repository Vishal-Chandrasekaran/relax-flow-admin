// import { AppDispatch } from "store/store";
// import * as Api from '../apiAction/journeyApi'
// import { setLoader } from "store/reducers/layoutReducer";
// import { getAllJourneyData, getAllJourneyWeekZero } from "store/reducers/journeyReducer";

// export const getJourneyData = (id: any) => async (dispatch: AppDispatch) => {
//     setLoader(true);
//     try {
//         const res: any = await Api.getJourenyDataApi(id); // Assuming there's a typo in 'getJourneyDataApi'
//         dispatch(getAllJourneyData(res));
//         return res;
//     } catch (error) {
//         console.error('Failed to fetch journey data:', error);
//     } finally {
//         setLoader(false);
//     }
// }

// export const getJourneyWeekZero = (id: any) => async (dispatch: AppDispatch) => {
//     setLoader(true);
//     try {
//         const res: any = await Api.getJourenyWeekZeroApi(id); 
//         dispatch(getAllJourneyWeekZero(res));
//         return res;
//     } catch (error) {
//         console.error('Failed to fetch journey data:', error);
//     } finally {
//         setLoader(false);
//     }
// }

// export const setBaselineQuestionnaire = ( user_id: number) => async (_dispatch: AppDispatch) => Api.setBaselineQuestionnaireApi( user_id);


// // export const getMedicalRecord = (id: any) => async (dispatch: AppDispatch) => {
// //     setLoader(true);
// //     try {
// //         const res: any = await Api.getMedicalRecordApi(id);
// //         dispatch(updateMedicalRecord(res?.data?.medical_report));
// //         return res;
// //     } catch (error) {
// //        return console.error('Failed to fetch Medical Record data:', error);
// //     } finally {
// //         setLoader(false);
// //     }
// // };
