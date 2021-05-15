function getVaccination(vaccination, allVaccination) {
  return allVaccination.find(x => x.id === vaccination.tcVaccinatedDisease.id)
}

export default {
  getIntervalDays(vaccination, allVaccination) {
    return (
      (allVaccination.find(x => x.id === vaccination.tcVaccinatedDisease.id)?.vaccines || []).find(
        x => x.name === vaccination.vaccinationName,
      )?.doseInterval || []
    ).find(x => x.afterDose === vaccination.dose)?.intervalDays
  },

  getMandatory(vaccination, allVaccination) {
    return getVaccination(vaccination, allVaccination)?.mandatory
  },

  getDisease(vaccination, allVaccination) {
    return getVaccination(vaccination, allVaccination)?.disease
  },
}
