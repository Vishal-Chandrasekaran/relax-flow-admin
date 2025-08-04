
import axios from '../../utils/axiosConfig';
import { generateUniqueId } from '../../utils/CommonService';

export const getJourenyDataApi = (id: number) =>
    axios.get(`/wp-json/wp/v2/user/my-journey/${id ?? 0}`, { params: { cache: generateUniqueId(), study_type: 1 } });

export const getJourenyWeekZeroApi = (id: number) =>
    axios.get(`/wp-json/wp/v2/user/before-start-journey/${id}`, { params: { cache: generateUniqueId() } });

export const setBaselineQuestionnaireApi = (id: number) =>
    axios.post(`/wp-json/wp/v2/user/start-baseline-questionnire/${id}`, { params: { cache: generateUniqueId() } });

// export const getMedicalRecordApi = (id: number) => axios.get(`wp-json/wp/v2/user/medical-report/${id}`,{params:{ cache:generateUniqueId() }});
