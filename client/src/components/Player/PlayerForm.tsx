import React, { useEffect } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { useQueryClient } from '@tanstack/react-query';
import { useToastContext } from '~/Providers';
import { useLocalize } from '~/hooks';
import { logger } from '~/utils';
import { Input, Label } from '~/components';
import { Select, SelectItem } from '@radix-ui/react-select';
import { Button, OGDialog, OGDialogTemplate, Textarea } from '../ui';
import type { TPlayer, TPlayerRequest } from 'librechat-data-provider';
import { usePlayerMutation } from '~/data-provider';

type TPlayerFormProps = {
    player?: TPlayer;
    formRef?: React.RefObject<HTMLFormElement>;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
    mutation: ReturnType<typeof usePlayerMutation>
};

const numberRule = (label: string) => ({
    required: `${label} is required`,
    valueAsNumber: true,
    min: { value: 0, message: `${label} must be ≥ 0` },
    max: { value: 99, message: `${label} must be ≤ 99` },
});

const skillRule = (label: string) => ({
    required: `${label} is required`,
    valueAsNumber: true,
    min: { value: 1, message: `${label} must be between 1 and 5` },
    max: { value: 5, message: `${label} must be between 1 and 5` },
});

const PlayerForm = ({ player, mutation, setOpen, formRef }: TPlayerFormProps) => {
    const localize = useLocalize();
    const { showToast } = useToastContext();
    const queryClient = useQueryClient();

    const {
        register,
        control,
        handleSubmit,
        setValue,
        formState: { errors },
        watch,
    } = useForm<TPlayerRequest>({
        defaultValues: {
            first_name: player?.first_name ?? '',
            last_name: player?.last_name ?? '',
            position: player?.position ?? '',
            team: player?.team ?? '',
            preferred_foot: (player?.preferred_foot as 'Left' | 'Right') ?? 'Right',
            weak_foot: player?.weak_foot ?? 3,
            skill_moves: player?.skill_moves ?? 3,
            height: player?.height ?? '',
            weight: player?.weight ?? '',
            pace: player?.pace ?? 0,
            acceleration: player?.acceleration ?? 0,
            sprint_speed: player?.sprint_speed ?? 0,
            shooting: player?.shooting ?? 0,
            passing: player?.passing ?? 0,
            dribbling: player?.dribbling ?? 0,
            defending: player?.defending ?? 0,
            physicality: player?.physicality ?? 0,
            traits: player?.traits?.length ? player.traits : [{ name: '', description: '' }],
        },
    });

    const { fields, append, remove } = useFieldArray({
        control,
        name: 'traits',
    });

    useEffect(() => {
        if (player?.first_name != null) setValue('first_name', player.first_name);
        if (player?.last_name != null) setValue('last_name', player.last_name);
    }, [player, setValue]);


    const onSubmit = (values: TPlayerRequest) => {
        console.timeLog('concac');
        mutation.mutate(values, {
            onSuccess: () => {
                showToast({ message: 'Player saved'});
                setOpen(false);
            },
            onError: (err: any) => {
                logger.error(err);
                showToast({ message: err?.message ?? 'Failed to save player'});
            },
        });
    };

    const foot = watch('preferred_foot');

    return (
        <form
            ref={formRef}
            className="mt-6 flex h-[80vh] flex-col"
            aria-label="Player form"
            method="POST"
            onSubmit={handleSubmit(onSubmit)}
        >
            <div className="flex-1 min-h-0 overflow-y-auto pr-2">
                <div className="flex w-full flex-col gap-4">
                    {/* Identity */}
                    <section className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div className="grid gap-2">
                            <Label htmlFor="first_name">First Name</Label>
                            <Input
                                id="first_name"
                                aria-label="First Name"
                                {...register('first_name', { required: 'First name is required', maxLength: 64 })}
                                aria-invalid={!!errors.first_name}
                                placeholder="Kylian"
                            />
                            {errors.first_name && <span className="text-sm text-red-500">{errors.first_name.message}</span>}
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="last_name">Last Name</Label>
                            <Input
                                id="last_name"
                                aria-label="Last Name"
                                {...register('last_name', { required: 'Last name is required', maxLength: 64 })}
                                aria-invalid={!!errors.last_name}
                                placeholder="Mbappé"
                            />
                            {errors.last_name && <span className="text-sm text-red-500">{errors.last_name.message}</span>}
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="position">Primary Position</Label>
                            <Input
                                id="position"
                                aria-label="Position"
                                {...register('position', { required: 'Position is required', maxLength: 32 })}
                                placeholder="ST / LW / RW / CM / CB / GK"
                            />
                            {errors.position && <span className="text-sm text-red-500">{errors.position.message}</span>}
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="team">Team</Label>
                            <Input
                                id="team"
                                aria-label="Team"
                                {...register('team', { required: 'Team is required', maxLength: 64 })}
                                placeholder="PSG U23"
                            />
                            {errors.team && <span className="text-sm text-red-500">{errors.team.message}</span>}
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="preferred_foot">Preferred Foot</Label>
                            <Select
                                id="preferred_foot"
                                value={foot}
                                onValueChange={(v: 'Left' | 'Right') => setValue('preferred_foot', v, { shouldValidate: true })}
                            >

                            </Select>
                            {errors.preferred_foot && <span className="text-sm text-red-500">{errors.preferred_foot.message as string}</span>}
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="alt_positions">Alt. Positions</Label>
                            <Input
                                id="alt_positions"
                                aria-label="Alternate Positions"
                                {...register('alt_positions', { maxLength: 128 })}
                                placeholder="LW, RW, CF"
                            />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="weak_foot">Weak Foot (1–5)</Label>
                            <Input
                                type="number"
                                id="weak_foot"
                                {...register('weak_foot', skillRule('Weak foot'))}
                                placeholder="3"
                            />
                            {errors.weak_foot && <span className="text-sm text-red-500">{errors.weak_foot.message}</span>}
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="skill_moves">Skill Moves (1–5)</Label>
                            <Input
                                type="number"
                                id="skill_moves"
                                {...register('skill_moves', skillRule('Skill moves'))}
                                placeholder="3"
                            />
                            {errors.skill_moves && <span className="text-sm text-red-500">{errors.skill_moves.message}</span>}
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="height">Height</Label>
                            <Input
                                id="height"
                                {...register('height', { required: 'Height is required', maxLength: 16 })}
                                placeholder="178 cm"
                            />
                            {errors.height && <span className="text-sm text-red-500">{errors.height.message}</span>}
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="weight">Weight</Label>
                            <Input
                                id="weight"
                                {...register('weight', { required: 'Weight is required', maxLength: 16 })}
                                placeholder="72 kg"
                            />
                            {errors.weight && <span className="text-sm text-red-500">{errors.weight.message}</span>}
                        </div>
                    </section>

                    {/* Stats */}
                    <section className="rounded-lg border p-4">
                        <p className="mb-3 text-sm font-medium">Stats (0–99)</p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                            <FieldNumber id="pace" label="Pace" register={register('pace', numberRule('Pace'))} error={errors?.pace?.message} />
                            <FieldNumber id="acceleration" label="Acceleration" register={register('acceleration', numberRule('Acceleration'))} error={errors?.acceleration?.message} />
                            <FieldNumber id="sprint_speed" label="Sprint Speed" register={register('sprint_speed', numberRule('Sprint Speed'))} error={errors?.sprint_speed?.message} />
                            <FieldNumber id="shooting" label="Shooting" register={register('shooting', numberRule('Shooting'))} error={errors?.shooting?.message} />
                            <FieldNumber id="passing" label="Passing" register={register('passing', numberRule('Passing'))} error={errors?.passing?.message} />
                            <FieldNumber id="dribbling" label="Dribbling" register={register('dribbling', numberRule('Dribbling'))} error={errors?.dribbling?.message} />
                            <FieldNumber id="defending" label="Defending" register={register('defending', numberRule('Defending'))} error={errors?.defending?.message} />
                            <FieldNumber id="physicality" label="Physicality" register={register('physicality', numberRule('Physicality'))} error={errors?.physicality?.message} />
                        </div>
                    </section>

                    {/* Traits (dynamic) */}
                    <section className="rounded-lg border p-4">
                        <div className="flex items-center justify-between mb-2">
                            <p className="text-sm font-medium">Traits</p>
                            <Button
                                type="button"
                                size="sm"
                                onClick={() => append({ name: '', description: '' })}
                            >
                                + Add Trait
                            </Button>
                        </div>

                        <div className="flex flex-col gap-3">
                            {fields.map((field, index) => (
                                <div key={field.id} className="grid grid-cols-1 md:grid-cols-6 gap-2">
                                    <div className="md:col-span-2">
                                        <Label htmlFor={`traits.${index}.name`}>Name</Label>
                                        <Input
                                            id={`traits.${index}.name`}
                                            {...register(`traits.${index}.name` as const, { required: 'Trait name is required', maxLength: 64 })}
                                            placeholder="Flair"
                                        />
                                        {errors?.traits?.[index]?.name && (
                                            <span className="text-sm text-red-500">{errors.traits[index]?.name?.message as string}</span>
                                        )}
                                    </div>

                                    <div className="md:col-span-3">
                                        <Label htmlFor={`traits.${index}.description`}>Description</Label>
                                        <Textarea
                                            id={`traits.${index}.description`}
                                            {...register(`traits.${index}.description` as const, { maxLength: 256 })}
                                            placeholder="Comfortable taking on defenders 1v1"
                                            rows={2}
                                        />
                                        {errors?.traits?.[index]?.description && (
                                            <span className="text-sm text-red-500">{errors.traits[index]?.description?.message as string}</span>
                                        )}
                                    </div>

                                    <div className="md:col-span-1 flex items-end">
                                        <Button
                                            type="button"
                                            variant="destructive"
                                            onClick={() => remove(index)}
                                        >
                                            Remove
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Tip box */}
                    <div className="rounded-lg bg-muted p-3 text-sm text-muted-foreground mt-2 flex items-start gap-2">
                        <span className="text-xl">💡</span>
                        <p className="leading-tight">
                            Keep stats simple (0–99). Weak foot & skill moves are 1–5. Use commas for alternate positions.
                        </p>
                    </div>
                </div>
            </div>

            {/* Actions */}


        </form>
    );
};

export default PlayerForm;

/** Small helper for number inputs with errors */
function FieldNumber({
  id,
  label,
  register,
  error,
  placeholder,
}: {
  id: string;
  label: string;
  register: ReturnType<typeof registerInput>;
  error?: string;
  placeholder?: string;
}) {
  return (
    <div className="grid gap-2">
      <Label htmlFor={id}>{label}</Label>
      <Input id={id} type="number" {...register} placeholder={placeholder ?? '0'} />
      {error && <span className="text-sm text-red-500">{error}</span>}
    </div>
  );
}

// TS helper to keep the prop type for register()
declare function registerInput(name: string, options?: any): any;
