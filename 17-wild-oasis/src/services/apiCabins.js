import supabase from "./supabase";
import { supabaseUrl } from "./supabase";

export async function getCabins() {
  const { data, error } = await supabase.from("cabins").select("*");

  if (error) {
    console.error(error);
    throw new Error("Cabins could not be loaded");
  }
  return data;
}

export async function deleteCabin(id) {
  const { error } = await supabase.from("cabins").delete().eq("id", id);

  if (error) {
    if (error) {
      console.error(error);
      throw new Error("Cabin could not be deleted");
    }
  }

  return;
}

export async function createEditCabin(cabin, id) {
  //console.log(id);
  // return null;

  //url for manually uploaded file:
  //https://jjmzmtsvxxoqzmvzhsha.supabase.co/storage/v1/object/public/cabin-images/cabin-001.jpg

  //override the image value with the image path
  //make it unique with random prefix
  //we need the URL for this
  //replace any slashes because supabase will create a folder structure based on slashes

  //check the image object; a new image will yield a FileList,
  //while an edit without changing/uploading new file with yield a path
  const hasImagePath =
    typeof cabin.image === "string" && cabin.image?.startsWith(supabaseUrl);

  //we can override imageName here if we already have a path because
  //we will just use the existing image value rather than concatenating
  const imageName = hasImagePath
    ? ""
    : `${Math.random()}-${cabin.image.name.replace("/", "")}`;
  const imagePath = hasImagePath
    ? cabin.image
    : `${supabaseUrl}/storage/v1/object/public/cabin-images/${imageName}`;

  //don't override the image itself;
  //replace it in the mutate statement only
  //cabin.image = imagePath;

  //this is shared by both create and udate
  let query = await supabase.from("cabins");
  const isEdit = id ? true : false;

  //create only if id is null
  //define a query for either case
  //get data/error on execution, AFTER definition
  if (!isEdit) {
    //note that insert passes an ARRAY, because insert supports bulk insert

    query = query.insert([{ ...cabin, image: imagePath }]); //no need to deconstruct
  } else {
    query = query
      //note that update passes an OBJECT, and not an array, because update assumes a single record
      .update({ ...cabin, image: imagePath })
      .eq("id", id);
  }

  //now actually execute the query and get the values
  const { data, error } = await query
    .select() //required if you actually want to return the data just created
    .single();

  //check for errors
  if (error) {
    console.error(error);
    throw new Error(`Cabin could not be ${isEdit ? "updated" : "created"}`);
  }

  //if no error, upload the image file itself to the bucket
  //but only if not already a path
  if (!hasImagePath) {
    const { error: storageError } = await supabase.storage
      .from("cabin-images")
      .upload(imageName, cabin.image);

    if (storageError) {
      console.error(storageError);

      //delete the cabin if there was an error uploading the image
      deleteCabin(data[0].id);

      throw new Error("Image could not be uploaded; cabin not created");
    }
  }

  return data;
}
