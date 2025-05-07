import {UserSchema} from "../entity/user.entity.js";
import { AppDataSource } from "../config/configDB.js";

export async function getUserService(query) {
  try {
    const { rut, id, correo } = query;

    const userRepository = AppDataSource.getRepository(UserSchema);

    const userFound = await userRepository.findOne({
      where: [{ id: id }, { rut: rut }, { correo: correo }],
    });

    if (!userFound) return [null, "Usuario no encontrado"];

    const { password, ...userData } = userFound;

    return [userData, null];
  } catch (error) {
    console.error("Error obtener el usuario:", error);
    return [null, "Error interno del servidor"];
  }
}

export async function getUsersService() {
  try {
    const userRepository = AppDataSource.getRepository(UserSchema);

    const users = await userRepository.find();

    if (!users || users.length === 0) return [null, "No hay usuarios"];

    const usersData = users.map(({ password, ...user }) => user);

    return [usersData, null];
  } catch (error) {
    console.error("Error al obtener a los usuarios:", error);
    return [null, "Error interno del servidor"];
  }
}

export async function updateUserService(query, body) {
  try {
    const { id, rut, correo } = query;

    const userRepository = AppDataSource.getRepository(UserSchema);

    const userFound = await userRepository.findOne({
      where: [{ id: id }, { rut: rut }, { correo: correo }],
    });

    if (!userFound) return [null, "Usuario no encontrado"];

    const existingUser = await userRepository.findOne({
      where: [{ rut: body.rut }, { correo: body.correo }],
    });

    if (existingUser && existingUser.id !== userFound.id) {
      return [null, "Ya existe un usuario con el mismo rut o correo"];
    }

    if (body.telefono && !/^\+569\d{8}$/.test(body.telefono)) {
      return [null, "Número de teléfono inválido. Debe comenzar con +569 y tener 8 dígitos."];
    }

    const dataUserUpdate = {
      nombreCompleto: body.nombreCompleto,
      rut: body.rut,
      correo: body.correo,
      telefono: body.telefono
    };

    await userRepository.update({ id: userFound.id }, dataUserUpdate);

    const userData = await userRepository.findOne({
      where: { id: userFound.id },
    });

    if (!userData) {
      return [null, "Usuario no encontrado después de actualizar"];
    }

    const { password, ...userUpdated } = userData;

    return [userUpdated, null];
  } catch (error) {
    console.error("Error al modificar un usuario:", error);
    return [null, "Error interno del servidor"];
  }
}

export async function deleteUserService(query) {
  try {
    const { id, rut, correo } = query;

    const userRepository = AppDataSource.getRepository(UserSchema);

    const userFound = await userRepository.findOne({
      where: [{ id: id }, { rut: rut }, { correo: correo }],
    });

    if (!userFound) return [null, "Usuario no encontrado"];

    if (userFound.rol === "administrador") {
      return [null, "No se puede eliminar un usuario con rol de administrador"];
    }

    const userDeleted = await userRepository.remove(userFound);

    const { password, ...dataUser } = userDeleted;

    return [dataUser, null];
  } catch (error) {
    console.error("Error al eliminar un usuario:", error);
    return [null, "Error interno del servidor"];
  }
}

export async function createUserService(user) {
  try {
    const userRepository = AppDataSource.getRepository(UserSchema);

    const { nombreCompleto, rut, correo, telefono } = user;

    const createErrorMessage = (dataInfo, message) => ({
      dataInfo,
      message
    });
    
    const existingEmailUser = await userRepository.findOne({
      where: {
        correo,
      },
    });

    if (existingEmailUser) return [null, createErrorMessage("email", "Correo electrónico en uso")];

    const existingRutUser = await userRepository.findOne({
      where: {
        rut,
      },
    });
    
    if (existingRutUser) return [null, createErrorMessage("rut", "Rut ya asociado a una cuenta")];

    if (telefono && !/^\+569\d{8}$/.test(telefono)) {
      return [null, createErrorMessage("telefono", "Formato de teléfono inválido")];
    }

    const newUser = userRepository.create({
      nombreCompleto,
      correo,
      rut,
      telefono
    });

    await userRepository.save(newUser);

    const { password, ...dataUser } = newUser;

    return [dataUser, null];
  } catch (error) {
    console.error("Error al registrar un usuario", error);
    return [null, "Error interno del servidor"];
  }
}