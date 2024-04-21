interface IUser {
  email: string
  name: string
  uid: string
  password: string
  confirmPassword: string
}

interface IPet {
  id: any
  ownerId: string
  name: string
  age: string
  species: string
  breed: string
  color: string
  gender: string
  vaccinationRecords: string
  medsSupplements: string
  allergiesSensitivities: string
  prevIllnessesInjuries: string
  diet: string
  exerciseHabits: string
  indoorOrOutdoor: string
  reproductiveStatus: string
  image: string
  notes: string
  threadId: string
  flaggedForConcern: boolean;
}

export interface IAuthenticatedUser {
  email: string
  name: string
}

interface IJournalEntry {
  ownerId: string,
  petName: string,
  date: string,
  entry: string
}



