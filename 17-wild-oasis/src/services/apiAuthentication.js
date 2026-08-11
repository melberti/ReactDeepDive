import supabase from "./supabase";
import { supabaseUrl } from "./supabase";

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
  const { data: session } = await supabase.auth.getSession();

  if (!session.session) {
    return null; //no auth'd user
  }

  const { data, error } = await supabase.auth.getUser();

  if (error) throw new Error(error.message);
  return data?.user;
}

export async function logout() {
  let { error } = await supabase.auth.signOut();

  if (error) throw new Error(error.message);
  //no need to return anything
}

export async function signUp({ fullName, email, password }) {
  //signup takes only email and password
  //but we can pass additional info by adding an options object with data property and any sub-properties we need
  let { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        fullName,
        avatar: "",
      },
    },
  });

  if (error) throw new Error(error.message);

  return { data, error };
}

export async function updateUser({ fullName, avatar, password }) {
  let updateData;

  //update password OR fullName; two different forms so it will be one or the other only
  if (fullName) {
    updateData = { data: { fullName } };
  } else if (password) {
    updateData = { password };
  }

  const { data, error } = await supabase.auth.updateUser(updateData);

  if (error) throw new Error(error.message);

  //if no avatar, we are done
  if (!avatar) {
    return data;
  }

  //create filename for avatar for saving to table
  const fileName = `avatar-${data.user.id}-${Math.random()}`;
  //here, avatar contains the image file itself
  //while filename contains the name we created based on user ID
  const { error: storageError } = await supabase.storage
    .from("avatar")
    .upload(fileName, avatar);

  if (storageError) throw new Error(storageError.message);

  //then update user metadata again with avatar if provided
  const imagePath = `${supabaseUrl}/storage/v1/object/public/avatar/${fileName}`;
  const { data: updatedUser, error: avatarError } =
    await supabase.auth.updateUser({
      data: { avatar: imagePath },
    });
  if (avatarError) throw new Error(avatarError.message);

  return updatedUser;
}
