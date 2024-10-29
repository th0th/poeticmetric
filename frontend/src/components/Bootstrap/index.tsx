import { useForm } from "react-hook-form";
import Title from "~/components/Title";

type Form = {
  createDemoSite: boolean;
  organizationName: string;
  userEmail: string;
  userName: string;
  userNewPassword: string;
  userNewPassword2: string;
};

export default function Bootstrap() {
  const { handleSubmit, register } = useForm<Form>({});

  function submit(data: Form) {
    console.log(data);
  }

  return (
    <>
      <Title>Complete Unius Analytics installation</Title>

      <div className="container-default py-8">
        <div className="text-center">
          <h1>Welcome to Unius Analytics!</h1>

          <div className="mt-3">Complete Unius Analytics installation to continue.</div>
        </div>

        <div className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"></div>

        <div className="card mx-auto mt-8 max-w-lg">
          <form className="card-body" onSubmit={handleSubmit(submit)}>
            <fieldset className="space-y-4">
              <div className="form-group">
                <label className="form-label" htmlFor="input-user-name">Full name</label>

                <input className="form-input" id="input-user-name" {...register("userName")} />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="input-user-email">E-mail address</label>

                <input className="form-input" id="input-user-email" type="email" {...register("userEmail")} />
              </div>

              <div className="form-group">
                <label className="form-label">New password</label>

                <input className="form-input" type="password" {...register("userNewPassword")} />
              </div>

              <div className="form-group">
                <label className="form-label">New password (again)</label>

                <input className="form-input" type="password" {...register("userNewPassword2")} />
              </div>

              <div className="flex items-center gap-2">
                <input className="form-check" id="input-create-demo-site" type="checkbox" />

                <label className="form-label" htmlFor="input-create-demo-site">Create demo site</label>
              </div>

              <button className="button button-primary w-full" type="submit">Complete installation</button>
            </fieldset>
          </form>
        </div>
      </div>
    </>
  );
}
