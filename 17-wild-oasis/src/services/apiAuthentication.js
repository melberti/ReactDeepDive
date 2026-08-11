import supabase from "./supabase";

//note this is ONE argument (an object with email and pw properties)
//rather than two arguments
export async function login({ email, password }) {
  let { data, error } = await supabase.auth.signInWithPassword({
    email: email,
    password: password,
  });

  if (error) throw new Error(error.message);

  return { data, error };
}

export async function getCurrentUser() {
  //console.log("calling getUser api");

  const { data: session } = await supabase.auth.getSession();

  if (!session.session) {
    console.log("no session data, returning null");
    return null; //no auth'd user
  }

  const { data, error } = await supabase.auth.getUser();

  if (error) throw new Error(error.message);
  return data?.user;
}

export async function logout() {
  console.log("calling logout API");

  let { error } = await supabase.auth.signOut();

  if (error) throw new Error(error.message);
  //no need to return anything
}
