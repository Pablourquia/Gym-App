# Generated by Django 5.0.7 on 2024-08-07 09:32

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0002_remove_exercise_reps_remove_routine_exercises'),
    ]

    operations = [
        migrations.CreateModel(
            name='RoutineExercise',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('sets', models.IntegerField()),
                ('exercise', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='api.exercise')),
                ('routine', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='api.routine')),
            ],
        ),
        migrations.AddField(
            model_name='routine',
            name='exercises',
            field=models.ManyToManyField(through='api.RoutineExercise', to='api.exercise'),
        ),
        migrations.CreateModel(
            name='RoutineSession',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('date', models.DateField(auto_now_add=True)),
                ('routine', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='api.routine')),
            ],
        ),
        migrations.CreateModel(
            name='ExerciseSet',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('set_number', models.IntegerField()),
                ('reps', models.IntegerField()),
                ('weight', models.FloatField()),
                ('rir', models.IntegerField()),
                ('exercise', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='api.exercise')),
                ('routine_session', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='api.routinesession')),
            ],
        ),
    ]