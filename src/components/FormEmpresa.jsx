import React from "react";

const FormEmpresa = ({ empresa, onSubmit }) => {
  const [form, setForm] = React.useState(
    empresa || {
      nome: "",
      cnpj: "",
      subdomain: "",
      plano: "BASIC",
      ativo: true,
    }
  );

  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    setForm((f) => ({
      ...f,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    onSubmit(form);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block font-medium">Nome</label>
        <input
          type="text"
          name="nome"
          value={form.nome}
          onChange={handleChange}
          required
          className="border px-3 py-2 rounded w-full"
        />
      </div>
      <div>
        <label className="block font-medium">CNPJ</label>
        <input
          type="text"
          name="cnpj"
          value={form.cnpj}
          onChange={handleChange}
          required
          className="border px-3 py-2 rounded w-full"
        />
      </div>
      <div>
        <label className="block font-medium">Subdomínio</label>
        <input
          type="text"
          name="subdomain"
          value={form.subdomain}
          onChange={handleChange}
          required
          className="border px-3 py-2 rounded w-full"
        />
      </div>
      <div>
        <label className="block font-medium">Plano</label>
        <select
          name="plano"
          value={form.plano}
          onChange={handleChange}
          className="border px-3 py-2 rounded w-full"
        >
          <option value="BASIC">BASIC</option>
          <option value="PRO">PRO</option>
        </select>
      </div>
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          name="ativo"
          checked={form.ativo}
          onChange={handleChange}
        />
        <label className="font-medium">Empresa Ativa</label>
      </div>
      <div className="flex gap-4 mt-4">
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Salvar
        </button>
        <button
          type="button"
          onClick={() =>
            typeof onSubmit === "function" ? onSubmit(null) : null
          }
          className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400"
        >
          Cancelar
        </button>
      </div>
    </form>
  );
};

export default FormEmpresa;
